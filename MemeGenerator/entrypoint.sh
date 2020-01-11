#!/bin/sh

mkdir $PWD/dataset
unzip $PWD/iexec_in/$IEXEC_DATASET_FILENAME -d $PWD/dataset
python3 $PWD/src/memegenerator.py $@
rm -r $PWD/dataset
