#!/bin/bash

script_dir="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "${script_dir}"

commit_hash="$(git rev-parse --short HEAD)"

npm run build

docker build \
    -t "dclandau/time-logger:frontend_${commit_hash}" \
    --build-arg COMMIT_HASH="${commit_hash}" \
    "${script_dir}"

docker push "dclandau/time-logger:frontend_${commit_hash}"
