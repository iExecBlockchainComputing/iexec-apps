#!/bin/bash

vanityResult=/iexec_out/keypair.txt
consensusFile=/iexec_out/determinism.iexec

vanitygen $@ >> $vanityResult
cat $vanityResult

vanityPattern=$(grep 'Pattern:' $vanityResult | sed 's/^.*: //')
publicAddress=$(grep 'Address: '$vanityPattern $vanityResult | sed 's/^.*: //')

publicAddressLength=${#publicAddress}

rm -f $consensusFile
echo $vanityPattern >> $consensusFile
echo $publicAddressLength >> $consensusFile