#!/bin/bash


# delete the consensus file if it already exists
rm /iexec/consensus.iexec 2> /dev/null

#get the width and height of the video
width=`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 $1 | tr x ' ' | awk -F ' ' '{print $1}'`
height=`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 $1 | tr x ' ' | awk -F ' ' '{print $2}'`

frame_rate=`ffprobe -v 0 -of csv=p=0 -select_streams 0 -show_entries stream=r_frame_rate $1 | bc -l`
# print the output in the consensus.iexec file
python blurFace.py $1 $width $height $frame_rate 2>&1 | tee -a /iexec/consensus.iexec
