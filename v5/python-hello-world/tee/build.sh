#!/bin/sh
cd $(dirname $0)
docker image build -f ../tee/Dockerfile -t nexus.iex.ec/tee-python-hello-world:4.0.0 .. $@
