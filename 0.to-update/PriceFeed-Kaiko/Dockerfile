FROM iexechub/sconecuratedimages-iexec:cli-alpine AS scone

FROM iexechub/sconecuratedimages-iexec:python-3.7.3-alpine-3.10

COPY --from=scone   /opt/scone/scone-cli    /opt/scone/scone-cli
COPY --from=scone   /usr/local/bin/scone    /usr/local/bin/scone
COPY --from=scone   /opt/scone/bin          /opt/scone/bin

################################

### install apk packages
RUN apk add --no-cache bash build-base gcc libgcc

### install python3 dependencies
RUN SCONE_MODE=sim pip3 install eth_abi jsonpath-rw pysha3 attrdict python-gnupg web3

### copy the code inside the image
COPY ./src /app
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

################################

###  protect file system with scone
COPY ./protect-fs.sh /protect-fs.sh
RUN bash /protect-fs.sh /app
RUN rm /protect-fs.sh /keytag

ENTRYPOINT /entrypoint.sh

#docker image build -t iexechub/trusted-kaiko-pricefeed:2.0.0-alpha .



#COPY signer /signer

#RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.5/community" >> /etc/apk/repositories \
#	&& apk update \
#	&& apk add --no-cache --update-cache libgcc \
#	&& apk add --no-cache --update-cache gcc gfortran python python-dev py-pip build-base wget freetype-dev libpng-dev \
#	&& apk add --no-cache --virtual .build-deps gcc musl-dev

#RUN SCONE_MODE=sim SCONE_HASH=1 SCONE_HEAP=1G SCONE_ALPINE=1          \
#	&& mkdir conf                                                       \
#	&& scone fspf create fspf.pb                                        \
#	&& scone fspf addr fspf.pb /       --not-protected --kernel /       \
#	&& scone fspf addr fspf.pb /usr    --authenticated --kernel /usr    \
#	&& scone fspf addf fspf.pb /usr                             /usr    \
#	&& scone fspf addr fspf.pb /bin    --authenticated --kernel /bin    \
#	&& scone fspf addf fspf.pb /bin                             /bin    \
#	&& scone fspf addr fspf.pb /lib    --authenticated --kernel /lib    \
#	&& scone fspf addf fspf.pb /lib                             /lib    \
#	&& scone fspf addr fspf.pb /etc/ssl --authenticated --kernel /etc/ssl       \
#	&& scone fspf addf fspf.pb /etc/ssl /etc/ssl                         \
#	&& scone fspf addr fspf.pb /sbin   --authenticated --kernel /sbin   \
#	&& scone fspf addf fspf.pb /sbin                            /sbin   \
#	&& scone fspf addr fspf.pb /signer --authenticated --kernel /signer \
#	&& scone fspf addf fspf.pb /signer                          /signer \
#	&& scone fspf addr fspf.pb /app    --authenticated --kernel /app    \
#	&& scone fspf addf fspf.pb /app                             /app    \
#	&& scone fspf encrypt ./fspf.pb > /conf/keytag                      \
#	&& MRENCLAVE="$(SCONE_HASH=1 python)"                               \
#	&& FSPF_TAG=$(cat conf/keytag | awk '{print $9}')                   \
#	&& FSPF_KEY=$(cat conf/keytag | awk '{print $11}')                  \
#	&& FINGERPRINT="$FSPF_KEY|$FSPF_TAG|$MRENCLAVE"                     \
#	&& echo $FINGERPRINT > conf/fingerprint.txt                         \
#	&& printf "\n"                                                      \
#	&& printf "#####################################################\n" \
#	&& printf "MREnclave: $FINGERPRINT\n"                               \
#	&& printf "#####################################################\n" \
#	&& printf "done"

#ENTRYPOINT unzip -o /iexec_in/$IEXEC_DATASET_FILENAME -d /iexec_in && python3 /app/app.py
