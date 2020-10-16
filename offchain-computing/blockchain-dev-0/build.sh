#!/bin/bash

path=$PWD

for package in `ls -d */`;
do
	echo $path/$package
	cd $path/$package && docker image build -f ./Dockerfile -t blockchain-dev-0-${package%?}:1.0.0 .
done

