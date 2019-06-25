#! /bin/bash

set -e

# Tag, Push and Deploy only if it's not a pull request
if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

    # Push only if we're merging into develop
    if [ "$TRAVIS_BRANCH" == "develop" ]; then

        echo Getting the ECR login...
        eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)

        # tag with branch and travis build number then push
        TAG=$(git rev-parse --short HEAD)
        echo Tagging with "$TAG"
        docker tag openelections_api:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$TAG"
        docker tag  openelections_app:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-app:"$TAG"
        docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$TAG"
        docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-app:"$TAG"

        # tag with "latest" then push
        TAG="latest"
        echo Tagging with "$TAG"
        docker tag openelections_api:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$TAG"
        docker tag  openelections_app:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-app:"$TAG"
        docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$TAG"
        docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-app:"$TAG"


        #echo Running ecs-deploy.sh script...
        #bin/ecs-deploy.sh  \
         #  --service-name "$ECS_SERVICE_NAME" \
          # --cluster "$ECS_CLUSTER"   \
           #--image "$REMOTE_DOCKER_PATH":latest \
          # --timeout 300
    else
        #echo "Skipping deploy because branch is not master"
        echo "Skipping deploy because tag is not set"
    fi
else
    echo "Skipping deploy because it's a pull request"
fi