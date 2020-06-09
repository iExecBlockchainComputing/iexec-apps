FROM node:8-alpine

# changing user
USER root

# add necessary packages
RUN apk add --no-cache git python make g++

# create a work directory inside the container
RUN mkdir /app
WORKDIR /app

# copy project files
COPY . .

# install utilities
RUN npm install -g yarn ts-node typescript

# install dependencies
RUN yarn

# making entrypoint executable
RUN chmod +x entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]
