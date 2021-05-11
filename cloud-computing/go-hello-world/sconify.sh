#!/bin/bash

docker run -it --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            registry.scontain.com:5050/sconecuratedimages/iexec-sconify-image:5.3.2 \
            sconify_iexec \
                --name=goHelloWorld \
                --from=go-hello-world \
                --to=nexus.iex.ec/tee-go-hello-world:6.2.0 \
                --binary-fs \
                --fs-file=/etc/hosts \
                --network=host \
                --nameserver=8.8.8.8 \
                --binary="/app/helloworld" \
                --heap="1G" \
                --dlopen="2" \
                --no-color \
                --verbose \
                --command="/app/helloworld"
