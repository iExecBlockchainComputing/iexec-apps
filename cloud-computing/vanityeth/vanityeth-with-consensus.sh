#!/bin/bash

vanityDefaultResultFile=VanityEth-log-*.txt
vanityResult="$IEXEC_OUT/keypair.txt"
deterministicTrace="$IEXEC_OUT/deterministic-trace.txt"
computedJsonFile="$IEXEC_OUT/computed.json"

vanityPattern=$1

rm -f $vanityDefaultResultFile $vanityResult $deterministicTrace

vanityeth -i $vanityPattern -l &> /dev/null

mv $vanityDefaultResultFile $vanityResult

if [[ -f $vanityResult ]]; then
	publicAddress=$(cat $vanityResult | grep -Po '"address": *\K"[^"]*"' | tr -d '"')
	publicAddressLength=${#publicAddress}

	echo "Address found is "$publicAddress
	echo "(private key inside "$vanityResult")"

	if [[ $publicAddress = "0x"$vanityPattern* ]]; then
		echo "Pattern "$vanityPattern" found">> $deterministicTrace
		echo $publicAddressLength >> $deterministicTrace
	fi
else
	echo "Bad input params"
	echo "Bad input params" >> $deterministicTrace
fi

echo "{ \"deterministic-output-path\": \"$deterministicTrace\" }" >> $computedJsonFile
