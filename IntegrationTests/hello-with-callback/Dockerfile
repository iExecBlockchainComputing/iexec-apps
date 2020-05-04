FROM python:3.7.3-alpine3.10

### install apk packages
RUN apk add --no-cache bash build-base gcc libgcc

### copy the code inside the image
COPY ./src /app
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

################################

ENTRYPOINT /entrypoint.sh

#docker image build -t nexus.iex.ec/hello-with-callback:0.0.1 .
