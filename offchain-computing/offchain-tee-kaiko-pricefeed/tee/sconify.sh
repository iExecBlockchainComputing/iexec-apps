#!/bin/bash

# declare the app entrypoint
ENTRYPOINT="python /app/app.py"
# declare an image name
IMG_NAME=offchain-tee-kaiko-pricefeed

IMG_FROM=${IMG_NAME}:temp-non-tee
IMG_TO=${IMG_NAME}:tee-debug

# build the regular non-TEE image
docker build .. -t ${IMG_FROM} -f ../tee/Dockerfile

# run the sconifier to build the TEE image based on the non-TEE image
docker run -it \
            -v /var/run/docker.sock:/var/run/docker.sock \
            registry.scontain.com:5050/scone-production/iexec-sconify-image:5.3.7 \
            sconify_iexec \
            --name=${IMG_NAME} \
            --from=${IMG_FROM} \
            --to=${IMG_TO} \
            --binary-fs \
            --fs-dir=/app \
            --host-path=/etc/hosts \
            --host-path=/etc/resolv.conf \
            --binary=/usr/local/bin/python3.7 \
            --heap=1G \
            --dlopen=2 \
            --no-color \
            --verbose \
            --command=${ENTRYPOINT} \
            && echo -e "\n------------------\n" \
            && echo "successfully built TEE docker image => ${IMG_TO}" \
            && echo "application mrenclave.fingerprint is $(docker run -it --rm -e SCONE_HASH=1 ${IMG_TO})"