#!/bin/bash

touch /tmp/ffmpeg.log
chmod 755 /tmp/ffmpeg.log

nohup /bin/ffmpeg $@ > /tmp/ffmpeg.log 2>&1

mkdir -p /iexec/
cat /tmp/ffmpeg.log  > /iexec/stdout.log
cat /tmp/ffmpeg.log | grep video >> /iexec/consensus.iexec
