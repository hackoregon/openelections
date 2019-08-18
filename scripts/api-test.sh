#! /bin/bash

set -e

export PATH=$PATH:$HOME/.local/bin

# tag with branch and travis build number then push
GITTAG=$(git rev-parse --short HEAD)

git diff-tree --no-commit-id --name-only -r $GITTAG | grep '^api/' || exit 0
echo Detected changes to api, running test suite
docker-compose -f docker-compose-test.yml pull testdb
docker-compose -f docker-compose-test.yml build api datatest
docker-compose -f docker-compose-test.yml run api npm test
