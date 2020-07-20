FROM sconecuratedimages/public-apps:node-10-alpine-scone3.0

### install dependencies you need
RUN apk add bash nodejs-npm
RUN mkdir /app && cd /app && SCONE_MODE=sim npm install figlet@1.x

COPY ./src /app

###  protect file system with Scone
COPY ./tee/protect-fs.sh ./tee/Dockerfile /build/
RUN sh /build/protect-fs.sh /app

ENTRYPOINT [ "node", "/app/app.js"]
