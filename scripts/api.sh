#! /bin/bash

set -e

export PATH=$PATH:$HOME/.local/bin

# tag with branch and travis build number then push
GITTAG=$(git rev-parse --short HEAD)

echo Checking last commit
git diff-tree --no-commit-id --name-only -r $GITTAG | grep '^api/' || exit 0
echo Detected changes to api

docker-compose  -f docker-compose-production.yml build api

echo Getting the ECR login...
eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)

echo Tagging with "$GITTAG"
docker tag openelections-api-production:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$GITTAG"
docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$GITTAG"

# tag with "latest" then push
TAG="latest"
echo Tagging with "$TAG"
docker tag openelections-api-production:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$TAG"
docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$TAG"

echo Running ecs-deploy.sh script...
scripts/ecs-deploy.sh  --skip-deployments-check -n openelections-api-staging -c openelections -i 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-api:"$GITTAG"
