#!/bin/sh
cd $(dirname $0)
docker image build -f ../classic/Dockerfile -t nexus.iex.ec/python-hello-world:4.0.0 .. $@
