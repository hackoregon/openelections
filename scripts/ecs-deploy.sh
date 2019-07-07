#!/usr/bin/env bash
set -o errexit
set -o pipefail
set -u

function usage() {
    set -e
    cat <<EOM
    ##### ecs-deploy #####
    Simple script for triggering blue/green deployments on Amazon Elastic Container Service
    https://github.com/silinternational/ecs-deploy

    One of the following is required:
        -n | --service-name     Name of service to deploy
        -d | --task-definition  Name of task definition to deploy

    Required arguments:
        -k | --aws-access-key        AWS Access Key ID. May also be set as environment variable AWS_ACCESS_KEY_ID
        -s | --aws-secret-key        AWS Secret Access Key. May also be set as environment variable AWS_SECRET_ACCESS_KEY
        -r | --region                AWS Region Name. May also be set as environment variable AWS_DEFAULT_REGION
        -p | --profile               AWS Profile to use - If you set this aws-access-key, aws-secret-key and region are needed
        -c | --cluster               Name of ECS cluster
        -i | --image                 Name of Docker image to run, ex: repo/image:latest
                                     Format: [domain][:port][/repo][/][image][:tag]
                                     Examples: mariadb, mariadb:latest, silintl/mariadb,
                                               silintl/mariadb:latest, private.registry.com:8000/repo/image:tag
        --aws-instance-profile  Use the IAM role associated with this instance

    Optional arguments:
        -D | --desired-count    The number of instantiations of the task to place and keep running in your service.
        -m | --min              minumumHealthyPercent: The lower limit on the number of running tasks during a deployment.
        -M | --max              maximumPercent: The upper limit on the number of running tasks during a deployment.
        -t | --timeout          Default is 90s. Script monitors ECS Service for new task definition to be running.
        -e | --tag-env-var      Get image tag name from environment variable. If provided this will override value specified in image name argument.
        --max-definitions       Number of Task Definition Revisions to persist before deregistering oldest revisions.
        -v | --verbose          Verbose output

    Requirements:
        aws:  AWS Command Line Interface
        jq:   Command-line JSON processor

    Examples:
      Simple deployment of a service (Using env vars for AWS settings):

        ecs-deploy -c production1 -n doorman-service -i docker.repo.com/doorman:latest

      All options:

        ecs-deploy -k ABC123 -s SECRETKEY -r us-east-1 -c production1 -n doorman-service -i docker.repo.com/doorman -t 240 -e CI_TIMESTAMP -v

      Updating a task definition with a new image:

        ecs-deploy -d open-door-task -i docker.repo.com/doorman:17

      Using profiles (for STS delegated credentials, for instance):

        ecs-deploy -p PROFILE -c production1 -n doorman-service -i docker.repo.com/doorman -t 240 -e CI_TIMESTAMP -v

    Notes:
      - If a tag is not found in image and an ENV var is not used via -e, it will default the tag to "latest"
EOM

    exit 2
}
if [ $# == 0 ]; then usage; fi

# Check requirements
function require {
    command -v "$1" > /dev/null 2>&1 || {
        echo "Some of the required software is not installed:"
        echo "    please install $1" >&2;
        exit 1;
    }
}

# Check for AWS, AWS Command Line Interface
require aws
# Check for jq, Command-line JSON processor
require jq

# Setup default values for variables
CLUSTER=false
SERVICE=false
TASK_DEFINITION=false
MAX_DEFINITIONS=0
IMAGE=false
MIN=false
MAX=false
TIMEOUT=90
VERBOSE=false
TAGVAR=false
AWS_CLI=$(which aws)
AWS_ECS="$AWS_CLI --output json ecs"

# Loop through arguments, two at a time for key and value
while [[ $# -gt 0 ]]
do
    key="$1"

    case $key in
        -k|--aws-access-key)
            AWS_ACCESS_KEY_ID="$2"
            shift # past argument
            ;;
        -s|--aws-secret-key)
            AWS_SECRET_ACCESS_KEY="$2"
            shift # past argument
            ;;
        -r|--region)
            AWS_DEFAULT_REGION="$2"
            shift # past argument
            ;;
        -p|--profile)
            AWS_PROFILE="$2"
            shift # past argument
            ;;
        --aws-instance-profile)
            echo "--aws-instance-profile is not yet in use"
            AWS_IAM_ROLE=true
            ;;
        -c|--cluster)
            CLUSTER="$2"
            shift # past argument
            ;;
        -n|--service-name)
            SERVICE="$2"
            shift # past argument
            ;;
        -d|--task-definition)
            TASK_DEFINITION="$2"
            shift
            ;;
        -i|--image)
            IMAGE="$2"
            shift
            ;;
        -t|--timeout)
            TIMEOUT="$2"
            shift
            ;;
        -m|--min)
            MIN="$2"
            shift
            ;;
        -M|--max)
            MAX="$2"
            shift
            ;;
        -D|--desired-count)
            DESIRED="$2"
            shift
            ;;
        -e|--tag-env-var)
            TAGVAR="$2"
            shift
            ;;
        --max-definitions)
            MAX_DEFINITIONS="$2"
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            ;;
        *)
            usage
            exit 2
        ;;
    esac
    shift # past argument or value
done

# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION and AWS_PROFILE can be set as environment variables
if [ -z ${AWS_ACCESS_KEY_ID+x} ]; then unset AWS_ACCESS_KEY_ID; fi
if [ -z ${AWS_SECRET_ACCESS_KEY+x} ]; then unset AWS_SECRET_ACCESS_KEY; fi
if [ -z ${AWS_DEFAULT_REGION+x} ];
  then unset AWS_DEFAULT_REGION
  else
          AWS_ECS="$AWS_ECS --region $AWS_DEFAULT_REGION"
fi
if [ -z ${AWS_PROFILE+x} ];
  then unset AWS_PROFILE
  else
          AWS_ECS="$AWS_ECS --profile $AWS_PROFILE"
fi

if [ $VERBOSE == true ]; then
    set -x
fi

if [ $SERVICE == false ] && [ $TASK_DEFINITION == false ]; then
    echo "One of SERVICE or TASK DEFINITON is required. You can pass the value using -n / --service-name for a service, or -d / --task-definiton for a task"
    exit 1
fi
if [ $SERVICE != false ] && [ $TASK_DEFINITION != false ]; then
    echo "Only one of SERVICE or TASK DEFINITON may be specified, but you supplied both"
    exit 1
fi
if [ $SERVICE != false ] && [ $CLUSTER == false ]; then
    echo "CLUSTER is required. You can pass the value using -c or --cluster"
    exit 1
fi
if [ $IMAGE == false ]; then
    echo "IMAGE is required. You can pass the value using -i or --image"
    exit 1
fi
if ! [[ $MAX_DEFINITIONS =~ ^-?[0-9]+$ ]]; then
    echo "MAX_DEFINITIONS must be numeric, or not defined."
    exit 1
fi

# Define regex for image name
# This regex will create groups for:
# - domain
# - port
# - repo
# - image
# - tag
# If a group is missing it will be an empty string
imageRegex="^([a-zA-Z0-9.\-]+):?([0-9]+)?/([a-zA-Z0-9._-]+)/?([a-zA-Z0-9._-]+)?:?([a-zA-Z0-9\._-]+)?$"

if [[ $IMAGE =~ $imageRegex ]]; then
  # Define variables from matching groups
  domain=${BASH_REMATCH[1]}
  port=${BASH_REMATCH[2]}
  repo=${BASH_REMATCH[3]}
  img=${BASH_REMATCH[4]}
  tag=${BASH_REMATCH[5]}

  # Validate what we received to make sure we have the pieces needed
  if [[ "x$domain" == "x" ]]; then
    echo "Image name does not contain a domain or repo as expected. See usage for supported formats." && exit 1;
  fi
  if [[ "x$repo" == "x" ]]; then
    echo "Image name is missing the actual image name. See usage for supported formats." && exit 1;
  fi

  # When a match for image is not found, the image name was picked up by the repo group, so reset variables
  if [[ "x$img" == "x" ]]; then
    img=$repo
    repo=""
  fi

else
  # check if using root level repo with format like mariadb or mariadb:latest
  rootRepoRegex="^([a-zA-Z0-9\-]+):?([a-zA-Z0-9\.\-]+)?$"
  if [[ $IMAGE =~ $rootRepoRegex ]]; then
    img=${BASH_REMATCH[1]}
    if [[ "x$img" == "x" ]]; then
      echo "Invalid image name. See usage for supported formats." && exit 1
    fi
    tag=${BASH_REMATCH[2]}
  else
    echo "Unable to parse image name: $IMAGE, check the format and try again" && exit 1
  fi
fi

# If tag is missing make sure we can get it from env var, or use latest as default
if [[ "x$tag" == "x" ]]; then
  if [[ $TAGVAR == false ]]; then
    tag="latest"
  else
    tag=${!TAGVAR}
    if [[ "x$tag" == "x" ]]; then
      tag="latest"
    fi
  fi
fi

# Reassemble image name
useImage=""
if [[ ! -z ${domain+undefined-guard} ]]; then
  useImage="$domain"
fi
if [[ ! -z ${port} ]]; then
  useImage="$useImage:$port"
fi
if [[ ! -z ${repo+undefined-guard} ]]; then
 if [[ ! "x$repo" == "x" ]]; then
  useImage="$useImage/$repo"
 fi
fi
if [[ ! -z ${img+undefined-guard} ]]; then
  if [[ "x$useImage" == "x" ]]; then
    useImage="$img"
  else
    useImage="$useImage/$img"
  fi
fi
imageWithoutTag="$useImage"
if [[ ! -z ${tag+undefined-guard} ]]; then
  useImage="$useImage:$tag"
fi

echo "Using image name: $useImage"

if [ $SERVICE != false ]; then
  # Get current task definition name from service
  TASK_DEFINITION=`$AWS_ECS describe-services --services $SERVICE --cluster $CLUSTER | jq -r .services[0].taskDefinition`
fi

echo "Current task definition: $TASK_DEFINITION";

# Get a JSON representation of the current task definition
# + Update definition to use new image name
# + Filter the def
DEF=$( $AWS_ECS describe-task-definition --task-def $TASK_DEFINITION \
        | sed -e "s|\"image\": *\"${imageWithoutTag}:.*\"|\"image\": \"${useImage}\"|g" \
        | sed -e "s|\"image\": *\"${imageWithoutTag}\"|\"image\": \"${useImage}\"|g" \
        | jq '.taskDefinition' )

# Default JQ filter for new task definition
NEW_DEF_JQ_FILTER="family: .family, volumes: .volumes, containerDefinitions: .containerDefinitions"

# Some options in task definition should only be included in new definition if present in
# current definition. If found in current definition, append to JQ filter.
CONDITIONAL_OPTIONS=(networkMode taskRoleArn)
for i in "${CONDITIONAL_OPTIONS[@]}"; do
  re=".*${i}.*"
  if [[ "$DEF" =~ $re ]]; then
    NEW_DEF_JQ_FILTER="${NEW_DEF_JQ_FILTER}, ${i}: .${i}"
  fi
done

# Build new DEF with jq filter
NEW_DEF=$(echo $DEF | jq "{${NEW_DEF_JQ_FILTER}}")

# Register the new task definition, and store its ARN
  NEW_TASKDEF=`$AWS_ECS register-task-definition --cli-input-json "$NEW_DEF" | jq -r .taskDefinition.taskDefinitionArn`
echo "New task definition: $NEW_TASKDEF";

if [ $SERVICE == false ]; then
  echo "Task definition updated successfully"
else
  DEPLOYMENT_CONFIG=""
  if [ $MAX != false ]; then
    DEPLOYMENT_CONFIG=",maximumPercent=$MAX"
  fi
  if [ $MIN != false ]; then
    DEPLOYMENT_CONFIG="$DEPLOYMENT_CONFIG,minimumHealthyPercent=$MIN"
  fi
  if [ ! -z "$DEPLOYMENT_CONFIG" ]; then
    DEPLOYMENT_CONFIG="--deployment-configuration ${DEPLOYMENT_CONFIG:1}"
  fi

  DESIRED_COUNT=""
  if [ ! -z ${DESIRED+undefined-guard} ]; then
    DESIRED_COUNT="--desired-count $DESIRED"
  fi

  # Update the service
  UPDATE=`$AWS_ECS update-service --cluster $CLUSTER --service $SERVICE $DESIRED_COUNT --task-definition $NEW_TASKDEF $DEPLOYMENT_CONFIG`

  # Only excepts RUNNING state from services whose desired-count > 0
  SERVICE_DESIREDCOUNT=`$AWS_ECS describe-services --cluster $CLUSTER --service $SERVICE | jq '.services[]|.desiredCount'`
  if [ $SERVICE_DESIREDCOUNT -gt 0 ]; then
    # See if the service is able to come up again
    every=10
    i=0
    while [ $i -lt $TIMEOUT ]
    do
      # Scan the list of running tasks for that service, and see if one of them is the
      # new version of the task definition

      RUNNING_TASKS=$($AWS_ECS list-tasks --cluster "$CLUSTER"  --service-name "$SERVICE" --desired-status RUNNING \
          | jq -r '.taskArns[]')

      if [[ ! -z $RUNNING_TASKS ]] ; then
        RUNNING=$($AWS_ECS describe-tasks --cluster "$CLUSTER" --tasks $RUNNING_TASKS \
          | jq ".tasks[]| if .taskDefinitionArn == \"$NEW_TASKDEF\" then . else empty end|.lastStatus" \
          | grep -e "RUNNING") || :

        if [ "$RUNNING" ]; then
          echo "Service updated successfully, new task definition running.";

          if [[ $MAX_DEFINITIONS -gt 0 ]]; then
            FAMILY_PREFIX=${TASK_DEFINITION##*:task-definition/}
            FAMILY_PREFIX=${FAMILY_PREFIX%*:[0-9]*}
            TASK_REVISIONS=`$AWS_ECS list-task-definitions --family-prefix $FAMILY_PREFIX --status ACTIVE --sort ASC`

            NUM_ACTIVE_REVISIONS=$(echo "$TASK_REVISIONS" | jq ".taskDefinitionArns|length")

            if [[ $NUM_ACTIVE_REVISIONS -gt $MAX_DEFINITIONS ]]; then
                LAST_OUTDATED_INDEX=$(($NUM_ACTIVE_REVISIONS - $MAX_DEFINITIONS - 1))
                for i in $(seq 0 $LAST_OUTDATED_INDEX); do
                    OUTDATED_REVISION_ARN=$(echo "$TASK_REVISIONS" | jq -r ".taskDefinitionArns[$i]")

                    echo "Deregistering outdated task revision: $OUTDATED_REVISION_ARN"

                    $AWS_ECS deregister-task-definition --task-definition "$OUTDATED_REVISION_ARN" > /dev/null
                done
            fi
          fi

          exit 0
        fi
      fi

      sleep $every
      i=$(( $i + $every ))
    done

    # Timeout
    echo "ERROR: New task definition not running within $TIMEOUT seconds"
    exit 1
  else
    echo "Skipping check for running task definition, as desired-count <= 0"
  fi
fi
