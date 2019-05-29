#!/bin/sh

if [[ $DATASET_FILENAME ]]
then
	export APIKEY=`cat iexec_in/$DATASET_FILENAME`;
fi

export WAIT_MIN=180000;
export WAIT_MAX=300000;

node src/oracle.js $@
