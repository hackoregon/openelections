#! /bin/bash

set -e

export PATH=$PATH:$HOME/.local/bin

sh scripts/data.sh
sh scripts/app.sh
sh scripts/api.sh
sh scripts/jobs.sh
