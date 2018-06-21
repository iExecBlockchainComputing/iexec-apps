#!/bin/sh
touch /tmp/ndmg_demo_dwi.log


chmod 755 /tmp/ndmg_demo_dwi.log

ndmg_demo_dwi | tee /tmp/ndmg_demo_dwi.log


mkdir -p /iexec/
echo "generate /iexec/consensus.iexec"

cat /tmp/ndmg_demo_dwi.log | grep Computing >> /iexec/consensus.iexec 
cat /tmp/ndmg_demo_dwi.log | grep "Subject Means" >> /iexec/consensus.iexec 
if [ -f /tmp/ndmg_demo/outputs/qa/graphs/desikan-res-4x4x4/desikan-res-4x4x4_plot.html ]
then
	cp -f /tmp/ndmg_demo/outputs/qa/graphs/desikan-res-4x4x4/desikan-res-4x4x4_plot.html /iexec/desikan-res-4x4x4_plot.html
fi
