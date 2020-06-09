FROM node:8.9.4

### install your dependencies
RUN mkdir /app && cd /app && npm install figlet

COPY ./src /app

ENTRYPOINT [ "node", "/app/app.js"]
