docker build -t time-logger/frontend .

docker run \
    -it --rm \
    -v "$(pwd)/node_modules:/app/node_modules" \
    --name time-logger-frontend \
    -p 3000:3000 \
    time-logger/frontend
