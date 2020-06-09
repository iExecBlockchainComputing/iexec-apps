#!/bin/bash

#vanityDefaultResultFile=Result-log-*.txt
resultFile=/iexec_out/result.txt
consensusFile=/iexec_out/determinism.iexec

mkdir /iexec_out
rm -f $resultFile $consensusFile

touch $resultFile
# count = number of Mb of the file
dd if=/dev/urandom of=$resultFile bs=1048576 count=500

echo "Determinist">> $consensusFile
