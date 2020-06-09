FROM ubuntu:16.04
RUN apt-get update
RUN apt-get install -y sudo
RUN apt-get install -y curl 
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN npm install -g vanity-eth --unsafe
RUN apt install -y openssl
COPY test.js /test.js

ENTRYPOINT ["node", "/test.js"]

# docker image build -t nexus.iex.ec/param-checker .