#!/bin/bash

touch /tmp/ffmpeg.log
chmod 755 /tmp/ffmpeg.log

nohup /bin/ffmpeg $@ > /tmp/ffmpeg.log 2>&1

mkdir -p /iexec_out/
mkdir -p /iexec_in/
cat /tmp/ffmpeg.log  > /iexec_out/stdout.log
cat /tmp/ffmpeg.log | grep video >> /iexec_out/determinism.iexec
cat >> /iexec_out/computed.json << EOF
{ "deterministic-output-path" : "/iexec_out/determinism.iexec" }
EOF

