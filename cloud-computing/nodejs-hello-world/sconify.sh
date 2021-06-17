#!/bin/bash

# Until the correct image is made available, do this workaround:
# docker image pull registry.scontain.com:5050/sconecuratedimages/iexec:node-14.4.0-alpine3.11
# docker image tag registry.scontain.com:5050/sconecuratedimages/iexec:node-14.4.0-alpine3.11 registry.scontain.com:5050/sconecuratedimages/node:14.4.0-alpine3.11

docker run -it --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            registry.scontain.com:5050/sconecuratedimages/iexec-sconify-image:5.3.6 \
            sconify_iexec \
                --name=nodejsHelloWorld \
                --from=nodejs-hello-world \
                --to=tee-nodejs-hello-world \
                --binary-fs \
                --fs-dir=/app \
                --host-path=/etc/hosts \
                --host-path=/etc/resolv.conf \
                --binary="/usr/local/bin/node" \
                --heap="1G" \
                --dlopen="2" \
                --no-color \
                --verbose \
                --command="node /app/app.js"
