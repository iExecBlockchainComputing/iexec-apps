#!/bin/sh
touch /tmp/ndmg_demo_dwi.log


chmod 755 /tmp/ndmg_demo_dwi.log

ndmg_demo_dwi | tee /tmp/ndmg_demo_dwi.log


mkdir -p /iexec/
echo "generate /iexec/consensus.iexec"

cat /tmp/ndmg_demo_dwi.log | grep Computing >> /iexec/consensus.iexec 
cat /tmp/ndmg_demo_dwi.log | grep "Subject Means" >> /iexec/consensus.iexec 
cat /iexec/consensus.iexec
