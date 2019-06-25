#! /bin/bash

if [ `uname -s` = "Linux" ]
then
sudo docker-compose  -f docker-compose-production.yml build api app
else
docker-compose -f docker-compose-production.yml build api app
fi
