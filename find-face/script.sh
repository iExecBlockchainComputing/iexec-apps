#!/bin/bash

# create the faces folder if it doesn't exist
if [ ! -d /iexec/faces ]; then
  mkdir -p /iexec/faces;
fi

# delete the consensus file if it already exists
rm /iexec/consensus.iexec 2> /dev/null

# print the output in the consensus.iexec file 
python findFace.py $1 2>&1 | tee -a /iexec/consensus.iexec

