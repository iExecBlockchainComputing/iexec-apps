#!/bin/sh

BASE=$PWD/iexec_out
RAW=$BASE/raw
PARAMS=$@
DETERMINISM=$BASE/determinism.iexec
ERROR=$BASE/error.txt

function pullTo
{
	mkdir $1
	cd $1
	wget $PARAMS
}

# cleanup
rm -rf $BASE/*

# get two copy to test determinism
pullTo $RAW
pullTo $RAW.copy

# worker protection against non deterministic queries
if diff $RAW $RAW.copy > /dev/null;
then
	# configure determinism (stdout is not deterministic)
	( echo -n "0x";	find $RAW -type f -exec sha256sum {} \; | sha256sum | cut -c1-64 ) > $DETERMINISM
	# rm copy
	rm -rf $RAW.copy
else
	# error
	echo "ERROR: result is not deterministic" > $ERROR
	# deterministic value
	( echo -n "0x"; cat $ERROR | sha256sum | cut -c1-64 ) >> $DETERMINISM
	# rm all data
	rm -rf $RAW $RAW.copy
fi
