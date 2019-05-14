#!/bin/sh

mkdir /dataset
unzip /iexec_in/$DATASET_FILENAME -d /dataset
python3 src/memegenerator.py $@
rm -r /dataset
