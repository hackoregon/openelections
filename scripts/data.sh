#! /bin/bash

set -e

export PATH=$PATH:$HOME/.local/bin

# tag with branch and travis build number then push
GITTAG=$(git rev-parse --short HEAD)

echo Checking last commit
git diff-tree --no-commit-id --name-only -r $GITTAG | grep '^datascience/' || exit 0
echo Detected changes to datascience

docker-compose  -f docker-compose-production.yml build data

echo Getting the ECR login...
eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)

echo Tagging with "$GITTAG"
docker tag  openelections-datascience-production:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-data:"$GITTAG"
docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-data:"$GITTAG"

# tag with "latest" then push
TAG="latest"
echo Tagging with "$TAG"
docker tag  openelections-datascience-production:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-data:"$TAG"
docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-data:"$TAG"

echo Running ecs-deploy.sh script...
scripts/ecs-deploy.sh  --skip-deployments-check -n openelections-data-staging -c openelections -i 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-data:"$GITTAG"
