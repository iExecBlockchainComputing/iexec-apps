# Offchain python hello-world app

## Standard mode
By default the application is built in **Standard** mode which
does not use TEE capabilities.

### Build
Standard mode application is built just like any other dockerized
application:
```
docker image build -f docker/Dockerfile -t offchain-python-hello-world .
```
**IMPORTANT:** /!\ Please note that the base python image should be
alpine based if the application will be converted into TEE mode.

### Run
The application can be tested locally to make sure it is well setup:
```
rm -rf /tmp/iexec_out && \
docker run \
        --rm \
        -e IEXEC_IN=/iexec_in \
        -e IEXEC_OUT=/iexec_out \
        -e IEXEC_DATASET_FILENAME=Lorem-ipsum.txt \
        -e IEXEC_INPUT_FILES_NUMBER=2 \
        -e IEXEC_INPUT_FILES_FOLDER=/iexec_in \
        -e IEXEC_INPUT_FILE_NAME_1=input-file1.txt \
        -e IEXEC_INPUT_FILE_NAME_2=input-file2.txt \
        -v /tmp/iexec_out:/iexec_out \
        -v $(pwd)/resources/data:/iexec_in \
        offchain-python-hello-world Alice
```
Once the execution ends, the result should be found in the folder
`/tmp/iexec_out`.
```
cat /tmp/iexec_out/computed.json
```

## TEE (protected) mode
To convert the application into **TEE** mode, first, it needs to be
built in **Standard** mode as instructed in the section above.
Then the standard image is converted using `sconify.sh` script into
a newly created TEE enabled image `tee-offchain-python-hello-world`:

### Build (conversion)
The script can edited to change parameters like **heap size**, new
image name, sources folder, ...

```
bash sconify.sh
```

### Run
(TODO test with CAS and session)

First of all, Intel® SGX driver needs to be present on the host machine.
These [instructions](https://github.com/intel/linux-sgx-driver) provide
information about how to install it.
The application can be tested locally to make sure it is well setup:
```
rm -rf /tmp/iexec_out && \
docker run \
        --rm \
        -e IEXEC_OUT=/iexec_out \
        -e IEXEC_IN=/iexec_in \
        -v /tmp/iexec_out:/iexec_out \
        -v $(pwd)/resources/data:/iexec_in \
        --device /dev/isgx \
        tee-offchain-python-hello-world Alice
```
To get the MREnclave value of the TEE application:
```
docker run -it --rm -e SCONE_HASH=1 tee-offchain-python-hello-world
```
