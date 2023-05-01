
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY ./package.json . 

RUN npm install 

COPY . . 

# start app
CMD ["npm", "start"]
