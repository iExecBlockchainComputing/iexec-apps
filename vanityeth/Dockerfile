FROM ubuntu:16.04
RUN apt-get update
RUN apt-get install -y sudo
RUN apt-get install -y curl 
RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN npm install -g vanity-eth --unsafe
COPY vanityeth-with-consensus.sh /vanityeth-with-consensus.sh
RUN chmod +x /vanityeth-with-consensus.sh
ENTRYPOINT ["/vanityeth-with-consensus.sh"]

# docker image build -t iexechub/vanityeth:3.0.0 .