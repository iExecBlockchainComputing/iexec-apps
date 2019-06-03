#!/bin/sh

BASE=$PWD/iexec_out
RAW=$BASE/raw
DETERMINISM=$BASE/determinism.iexec

rm -rf $BASE/*
mkdir $RAW
cd $RAW
wget $@
find $RAW -type f -exec sha256sum {} \; | sha256sum | cut -c1-64 > $DETERMINISM
