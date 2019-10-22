#!/bin/bash

vanityDefaultResultFile=VanityEth-log-*.txt
vanityResult=/iexec_out/keypair.txt
consensusFile=/iexec_out/determinism.iexec

vanityPattern=$1

rm -f $vanityDefaultResultFile $vanityResult $consensusFile

vanityeth -i $vanityPattern -l &> /dev/null

mv $vanityDefaultResultFile $vanityResult

if [[ -f $vanityResult ]]; then
	publicAddress=$(cat $vanityResult | grep -Po '"address": *\K"[^"]*"' | tr -d '"')
	publicAddressLength=${#publicAddress}

	echo "Address found is "$publicAddress
	echo "(private key inside "$vanityResult")"

	if [[ $publicAddress = "0x"$vanityPattern* ]]; then
		echo "Pattern "$vanityPattern" found">> $consensusFile
		echo $publicAddressLength >> $consensusFile
	fi
else
	echo "Bad input params"
	echo "Bad input params" >> $consensusFile
fi


