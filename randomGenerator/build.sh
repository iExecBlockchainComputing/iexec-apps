#!/bin/bash

docker image build -f Dockerfile-unsafe -t iexechub/random-generator-unsafe:0.0.1 .
docker image build -f Dockerfile-scone  -t iexechub/random-generator-scone:0.0.1 .
