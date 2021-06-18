#!/bin/bash

docker run -it --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            registry.scontain.com:5050/sconecuratedimages/iexec-sconify-image:5.3.6 \
            sconify_iexec \
                --name=goHelloWorld \
                --from=go-hello-world \
                --to=tee-go-hello-world \
                --binary-fs \
                --host-path=/etc/hosts \
                --host-path=/etc/resolv.conf \
                --binary="/app/helloworld" \
                --heap="1G" \
                --dlopen="2" \
                --no-color \
                --verbose \
                --command="/app/helloworld"
