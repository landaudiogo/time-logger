#!/bin/bash

if 
    grep "^time-logger-frontend$" \
        <(docker ps --format "{{.Names}}") > /dev/null
then
    docker stop time-logger-frontend \
        && docker rm time-logger-frontend
fi

docker run \
    -d \
    --name time-logger-frontend \
    --restart always \
    -p 0.0.0.0:80:3000 \
    "dclandau/time-logger:$1"
