#! /bin/bash

set -e

export PATH=$PATH:$HOME/.local/bin

sh scripts/api-test.sh
sh scripts/app-test.sh
