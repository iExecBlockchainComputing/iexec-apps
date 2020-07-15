#!/bin/bash

resultFile=/iexec_out/result.txt
consensusFile=/iexec_out/determinism.iexec

echo "creating folder"
mkdir /iexec_out
rm -f $resultFile $consensusFile

touch $resultFile
echo $((1 + RANDOM)) >> $resultFile

touch $consensusFile
echo $((1 + RANDOM)) >> $consensusFile

echo "done"
