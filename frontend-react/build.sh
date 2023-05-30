#!/bin/bash

script_dir="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "${script_dir}"

commit_hash="$(git rev-parse --short HEAD)"

cat <<EOF >.env
REACT_APP_COMMIT_HASH=${commit_hash}
EOF

npm run build

docker build \
    -t "dclandau/time-logger:frontend_${commit_hash}" \
    --build-arg COMMIT_HASH="${commit_hash}" \
    "${script_dir}"

docker push "dclandau/time-logger:frontend_${commit_hash}"
printf "\nfrontend_${commit_hash}\n"
