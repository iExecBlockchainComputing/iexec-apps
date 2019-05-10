#!/bin/sh

DATASET=/iexec_in/dataset.zip

mkdir /dataset
unzip $DATASET -d /dataset
python3 src/memegenerator.py $@
rm -r /dataset
