#!/bin/bash

touch /tmp/gnuplot.log
chmod 755 /tmp/gnuplot.log

mkdir -p /iexec_out/
mkdir -p /iexec_in/

echo  $@ > /tmp/gnuplot.log 2>&1
nohup /usr/bin/gnuplot $@ >> /tmp/gnuplot.log 2>&1

cat /tmp/gnuplot.log  > /iexec_out/stdout.log
cat /tmp/gnuplot.log | sha256sum >> /iexec_out/determinism.iexec
cat >> /iexec_out/computed.json << EOF
{ "deterministic-output-path" : "/iexec_out/determinism.iexec" }
EOF

