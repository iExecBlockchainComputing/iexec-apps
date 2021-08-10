# Offchain Python Kaiko Pricefeed app

## Standard mode
By default, the application is built in **Standard** mode which
does not use TEE capabilities.

### Build
Standard mode application is built just like any other dockerized
application:
```
docker image build -f docker/Dockerfile -t offchain-tee-kaiko-pricefeed .
```
**IMPORTANT:** /!\ Please note that the base python image should be
alpine based if the application will be converted into TEE mode.

### Run
The application can be tested locally to make sure it is well setup:
```
rm -rf $IEXEC_OUT && \
docker run \
        --rm \
        -e IEXEC_IN=/iexec_in \
        -e IEXEC_OUT=/iexec_out \
        -e IEXEC_DATASET_FILENAME=key.txt \
        -v $IEXEC_OUT:/iexec_out 
        -v $(pwd)/confidential-assets:/iexec_in
        offchain-tee-kaiko-pricefeed
```
Once the execution ends, the result should be found in the folder
`$IEXEC_OUT`.
```
cat $IEXEC_OUT/computed.json
```

## TEE (protected) mode
To convert the application into **TEE** mode, first, it needs to be
built in **Standard** mode as instructed in the section above.
Then the standard image is converted using `sconify.sh` script into
a newly created TEE enabled image `offchain-tee-kaiko-pricefeed:tee-debug`:

### Build (conversion)
The script can edited to change parameters like **heap size**, new
image name, sources folder, ...

```
bash sconify.sh
```

### Run
(TODO test with CAS and session)

First, Intel® SGX driver needs to be present on the host machine.
These [instructions](https://github.com/intel/linux-sgx-driver) provide
information about how to install it.
The application can be tested locally to make sure it is well setup:
```
rm -rf $IEXEC_OUT && \
docker run \
        --rm \
        -e IEXEC_IN=/iexec_in \
        -e IEXEC_OUT=/iexec_out \
        -e IEXEC_DATASET_FILENAME=key.txt \
        -v $IEXEC_OUT:/iexec_out 
        -v $(pwd)/confidential-assets:/iexec_in
        --device /dev/isgx
        offchain-tee-kaiko-pricefeed
```
To get the MREnclave value of the TEE application:
```
docker run -it --rm -e SCONE_HASH=1 offchain-tee-kaiko-pricefeed
```
