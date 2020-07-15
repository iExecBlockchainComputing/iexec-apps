#!/bin/sh

timeout=$1
args=${@:${#timeout}}}
echo "start xmrig with arg : ${args} and timeout: ${timeout}"
mkdir -p iexec
(xmrig ${args} ) & pid=$!
sleep ${timeout}  && echo "mined" >> iexec/consensus.iexec
cat /iexec/consensus.iexec
kill -SIGINT $pid
