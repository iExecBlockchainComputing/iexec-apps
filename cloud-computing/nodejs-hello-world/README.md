# Node hello-world app

## Standard mode
By default the application is built in **Standard** mode which
does not use TEE capabilities.

### Build
Standard mode application is built just like any other dockerized
application:
```
docker image build -t nodejs-hello-world .
```
**IMPORTANT:** /!\ Please note that the base node image should be in alpine if
it will be converted into TEE mode.**

### Run
The application can be tested locally to make sure it is well setup:
```
rm -rf /tmp/iexec_out && \
docker run \
        --rm \
        -e IEXEC_IN=/iexec_in \
        -e IEXEC_DATASET_FILENAME=Lorem-ipsum.txt \
        -e IEXEC_OUT=/iexec_out \
        -v /tmp/iexec_out:/iexec_out \
        -v $(pwd)/resources/dataset:/iexec_in \
        nodejs-hello-world Alice
```
Once the execution ends, the result should be found in the folder
`/tmp/iexec_out`.

## TEE (protected) mode
To convert the application into **TEE** mode, first, it needs to be
built in **Standard** mode as instructed in the section above.
Then the standard image is converted using `sconify.sh` script into
a newly created TEE enabled image `tee-nodejs-hello-world`:

### Build (conversion)
The script can edited to change parameters like **heap size**, new
image name, sources folder, ...

```
./sconify.sh
```

### Run
(TODO test with CAS and session)
The application can be tested locally to make sure it is well setup:
```
rm -rf /tmp/iexec_out && \
docker run \
        --rm \
        -e IEXEC_OUT=/iexec_out \
        -e IEXEC_IN=/iexec_in \
        -v /tmp/iexec_out:/iexec_out \
        -v $(pwd)/resources/dataset:/iexec_in \
        --device /dev/isgx \
        tee-nodejs-hello-world Alice
```
To get the MREnclave value of the TEE application:
```
docker run -it --rm -e SCONE_HASH=1 tee-nodejs-hello-world
```

<!-- ```
docker run -it --rm \
            -v /var/run/docker.sock:/var/run/docker.sock \
            registry.scontain.com:5050/sconecuratedimages/iexec-sconify-image:5.3.3 \
            sconify_iexec \
                --name=nodeHelloWorld \
                --from=nodejs-hello-world \
                --to=nexus.iex.ec/tee-nodejs-hello-world:6.2.0 \
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
``` -->