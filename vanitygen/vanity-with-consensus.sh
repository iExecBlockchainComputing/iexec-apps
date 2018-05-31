#!/bin/bash

vanityResult=/iexec/keypair.txt
consensusFile=/iexec/consensus.iexec

vanitygen $@ >> $vanityResult
cat $vanityResult

vanityPattern=$(grep 'Pattern:' $vanityResult | sed 's/^.*: //')
publicAddress=$(grep 'Address: '$vanityPattern $vanityResult | sed 's/^.*: //')

publicAddressLength=${#publicAddress}

rm -f $consensusFile
echo $vanityPattern >> $consensusFile
echo $publicAddressLength >> $consensusFile
