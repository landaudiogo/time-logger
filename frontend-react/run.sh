#!/bin/bash

docker build -t time-logger/frontend .

docker run \
    -it --rm \
    --name time-logger-frontend \
    -p 80:3000 \
    time-logger/frontend
