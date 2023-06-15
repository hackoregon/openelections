#! /bin/bash

set -e

export PATH=$PATH:$HOME/.local/bin

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

sh scripts/api-test.sh
sh scripts/app-test.sh
