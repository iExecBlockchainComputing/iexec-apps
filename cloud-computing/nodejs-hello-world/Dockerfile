FROM node:14-alpine3.10

### install your dependencies
RUN mkdir /app && cd /app && npm install figlet@1.x

COPY ./src /app

ENTRYPOINT [ "node", "/app/app.js"]
