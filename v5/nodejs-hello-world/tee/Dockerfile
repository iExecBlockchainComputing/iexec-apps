FROM sconecuratedimages/sconecli:alpine3.7-scone3.0 AS scone

FROM sconecuratedimages/apps:node-8.9.4-alpine-scone3.0

COPY --from=scone   /opt/scone/scone-cli    /opt/scone/scone-cli
COPY --from=scone   /usr/local/bin/scone    /usr/local/bin/scone
COPY --from=scone   /opt/scone/bin          /opt/scone/bin

### install dependencies you need
RUN apk add bash nodejs-npm
RUN mkdir /app && cd /app && SCONE_MODE=sim npm install figlet

COPY ./src /app

###  protect file system with Scone
COPY ./tee/protect-fs.sh ./tee/Dockerfile /build/
RUN sh /build/protect-fs.sh /app

ENTRYPOINT [ "node", "/app/app.js"]
