#!/bin/sh

if [[ $DATASET_FILENAME ]]
then
	export APIKEY=`cat iexec_in/$DATASET_FILENAME`;
fi

export WAIT_MIN=0;      # 0min
export WAIT_MAX=180000; # 3min

#export WAIT_MIN=1800000; # 30min
#export WAIT_MAX=2100000; # 35min

node src/oracle.js $@
