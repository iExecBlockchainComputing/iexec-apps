#!/bin/bash
cd $(dirname $0)

IMG_FROM=nodejs-hello-world
IMG_TO=docker.io/tee-nodejs-hello-world:debug

ARGS=$(sed -e "s'\${IMG_FROM}'${IMG_FROM}'" -e "s'\${IMG_TO}'${IMG_TO}'" sconify.args)
echo $ARGS

docker run -it --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            registry.scontain.com:5050/sconecuratedimages/iexec-sconify-image:5.3.6 \
            sconify_iexec $ARGS
