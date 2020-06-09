FROM debian:8
MAINTAINER Vladimir Ostapenco <vo@iex.ec>

RUN apt-get update && apt-get install -y gcc make git libssl-dev libpcre3-dev

RUN git clone https://github.com/cbeams/vanitygen.git /usr/local/src/vanitygen
RUN make --directory /usr/local/src/vanitygen
RUN ln -s /usr/local/src/vanitygen/vanitygen /usr/local/bin/vanitygen

COPY vanity-with-consensus.sh /vanity-with-consensus.sh
RUN chmod +x /vanity-with-consensus.sh

ENTRYPOINT ["/vanity-with-consensus.sh"]

# docker image build -t iexechub/vanitygen:1.0.2 .