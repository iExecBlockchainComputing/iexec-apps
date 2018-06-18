#!/bin/bash
echo "start xmrig with arg : $1"
(xmrig $1) & pid=$!
sleep 120  && kill -SIGINT $pid
