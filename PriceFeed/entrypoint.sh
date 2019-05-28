#!/bin/sh

if [[ $DATASET_FILENAME ]]
then
	export APIKEY=`cat iexec_in/$DATASET_FILENAME`;
fi

node src/oracle.js $@
