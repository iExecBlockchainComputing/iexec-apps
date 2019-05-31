#!/bin/sh

BASE=$PWD/iexec_out
RAW=$BASE/raw
SHASUM=$BASE/shasum.txt
DETERMINISM=$BASE/determinism.iexec

rm -r $BASE/*
mkdir $RAW
cd $RAW
wget -q $@
find $RAW -type f -exec sha256sum {} \; > $SHASUM
sha256sum $SHASUM > $DETERMINISM
