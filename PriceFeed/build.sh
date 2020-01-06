#!/bin/bash

docker image build -f Dockerfile-js        -t iexechub/app-price-oracle:0.0.3    .
docker image build -f Dockerfile-js        -t iexechub/pricefeed-js:0.0.3        .
docker image build -f Dockerfile-py-unsafe -t iexechub/pricefeed-py-unsafe:0.0.1 .
docker image build -f Dockerfile-py-scone  -t iexechub/pricefeed-py-scone:0.0.1  .
