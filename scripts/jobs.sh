#! /bin/bash

set -e

export PATH=$PATH:$HOME/.local/bin

# tag with branch and travis build number then push
GITTAG=$(git rev-parse --short HEAD)

echo Checking last commit
git diff-tree --no-commit-id --name-only -r $GITTAG | grep '^api/' || exit 0
echo Detected changes to api


docker-compose  -f docker-compose-production.yml build jobs

echo Getting the ECR login...
eval $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)

echo Tagging with "$GITTAG"
docker tag openelections-jobs-production:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-jobs:"$GITTAG"
docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-jobs:"$GITTAG"
docker tag openelections-jobs-production:latest 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-jobs:latest
docker push 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-jobs:latest

echo Running ecs-deploy.sh script...
scripts/ecs-deploy.sh  --skip-deployments-check -n openelections-jobs-staging -c openelections -i 845828040396.dkr.ecr.us-west-2.amazonaws.com/openelections-jobs:"$GITTAG"
