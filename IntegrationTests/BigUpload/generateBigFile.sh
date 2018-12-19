#!/bin/bash

#vanityDefaultResultFile=Result-log-*.txt
resultFile=/iexec/result.txt
consensusFile=/iexec/consensus.iexec

mkdir /iexec
rm -f $resultFile $consensusFile

touch $resultFile
fallocate -l 5G $resultFile

echo "Determinist">> $consensusFile
