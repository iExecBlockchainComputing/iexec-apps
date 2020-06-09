FROM sconecuratedimages/iexec:python-3.6.6-alpine3.6-new-rt
COPY --from=sconecuratedimages/iexec:cli-alpine /opt/scone/scone-cli /opt/scone/scone-cli
COPY --from=sconecuratedimages/iexec:cli-alpine /usr/local/bin/scone /usr/local/bin/scone
COPY --from=sconecuratedimages/iexec:cli-alpine /opt/scone/bin /opt/scone/bin
COPY signer /signer
RUN apk add bash --no-cache

# docker image build -t nexus.iex.ec/python-scone:1.0.2 .
