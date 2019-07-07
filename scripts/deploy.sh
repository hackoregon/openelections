#! /bin/bash

set -e

pip install --user awscli
export PATH=$PATH:$HOME/.local/bin

# install necessary dependency for ecs-deploy
add-apt-repository ppa:eugenesan/ppa
apt-get update
apt-get install jq -y

# Tag, Push and Deploy only if it's not a pull request
if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then

    # Push only if we're merging into develop
    if [ "$TRAVIS_BRANCH" == "develop" ]; then

        echo Getting the ECR login...
        eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)

        # tag with branch and travis build number then push
        GITTAG=$(git rev-parse --short HEAD)
        echo Tagging with "$TAG"
        docker tag openelections-api-production:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$GITTAG"
        docker tag  openelections-app-production:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-app:"$GITTAG"
        docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$GITTAG"
        docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-app:"$GITTAG"

        # tag with "latest" then push
        TAG="latest"
        echo Tagging with "$TAG"
        docker tag openelections_api:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$TAG"
        docker tag  openelections_app:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-app:"$TAG"
        docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$TAG"
        docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-app:"$TAG"

        #echo Running ecs-deploy.sh script...
        scripts/ecs-deploy.sh  -n openelections-staging-app -c openelections -i 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-app:"$GITTAG"
        scripts/ecs-deploy.sh  -n openelections-staging-api -c openelections -i 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$GITTAG"
    else
        #echo "Skipping deploy because branch is not master"
        echo "Skipping deploy because tag is not set"
    fi
else
    echo "Skipping deploy because it's a pull request"
fi
