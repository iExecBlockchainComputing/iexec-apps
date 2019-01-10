#!/bin/bash


resultFile=/iexec/result.txt
consensusFile=/iexec/consensus.iexec

mkdir /iexec
rm -f $resultFile $consensusFile

touch $resultFile
echo "result" >> $resultFile

touch $consensusFile
echo "consensus" >> $consensusFile

sleep 60
