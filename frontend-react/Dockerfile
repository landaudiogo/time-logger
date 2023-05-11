
FROM node:20.1.0-alpine3.17

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN npm install serve

ADD ./build ./build

# start app
CMD ["serve", "-s", "build", "-l", "3000"]
