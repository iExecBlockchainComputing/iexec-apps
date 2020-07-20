FROM sconecuratedimages/public-apps:python-3.7.3-alpine3.10-scone3.0

### install some python3 dependencies
RUN apk add gcc
RUN SCONE_MODE=sim pip3 install eth_abi

### copy the code inside the image
COPY ./src /app

###  protect file system with Scone
COPY ./tee/protect-fs.sh ./tee/Dockerfile /build/
RUN sh /build/protect-fs.sh /app

ENTRYPOINT ["python", "/app/app.py"]
