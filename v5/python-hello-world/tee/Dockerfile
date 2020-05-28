FROM sconecuratedimages/sconecli:alpine3.7-scone3.0 AS scone
FROM sconecuratedimages/apps:python-3.7.3-alpine3.10-scone3.0

COPY --from=scone   /opt/scone/scone-cli    /opt/scone/scone-cli
COPY --from=scone   /usr/local/bin/scone    /usr/local/bin/scone
COPY --from=scone   /opt/scone/bin          /opt/scone/bin

################################

### install python3 dependencies
RUN SCONE_MODE=sim pip3 install pyfiglet

### copy the code inside the image
COPY ./src /app
COPY ./tee/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

################################

###  protect file system with scone
COPY ./tee/protect-fs.sh /protect-fs.sh
RUN bash /protect-fs.sh /app
RUN rm /protect-fs.sh /keytag

ENTRYPOINT /entrypoint.sh
