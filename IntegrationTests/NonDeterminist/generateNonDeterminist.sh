#!/bin/bash


resultFile=/iexec/result.txt
consensusFile=/iexec/consensus.iexec

mkdir /iexec
rm -f $resultFile $consensusFile

touch $resultFile
echo $((1 + RANDOM % 10000)) >> $resultFile

touch $consensusFile
echo $((1 + RANDOM % 10000)) >> $consensusFile
