#!/bin/sh

if [[ $IEXEC_DATASET_FILENAME ]]
then
	export APIKEY=`cat iexec_in/$IEXEC_DATASET_FILENAME`;
fi

export WAIT_MIN=0;
export WAIT_MAX=0;

node src/oracle.js $@
