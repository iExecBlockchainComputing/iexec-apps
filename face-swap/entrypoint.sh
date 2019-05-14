#!/bin/bash

#app
FACESWAP_APP=/usr/local/lib/faceswap/faceswap.py

#created files
IMG1=/tmp/img1.jpg
IMG2=/tmp/img2.jpg
OUTPUT_IMG=/iexec_out/output.jpg
deterministFile=/iexec_out/determinism.iexec

#input params
IMG1_URL=$1
IMG2_URL=$2

if [[ -z $IMG1_URL ]]; then
	IMG1_URL="https://img-0.journaldunet.com/Xdg903b0Y60YZu4DqwPMlTapL9U=/540x/smart/f9c96ea8642c41349af09d287ef1828e/ccmcms-jdn/11076448.jpg"
	echo "WARN: Empty IMG1_URL, will use default IMG1 [IMG1_URL:$IMG1_URL]"
fi

if [[ -z $IMG2_URL ]]; then
	IMG2_URL="https://static3.7sur7.be/static/photo/2018/15/13/1/20180312072251/media_xll_10327921.jpg"
	echo "WARN: Empty IMG2_URL, will use default IMG2 [IMG2_URL:$IMG2_URL]"
fi

echo "Downloading IMG1 [IMG1_URL:$IMG1_URL]"
wget --quiet $IMG1_URL -O $IMG1
echo "Downloading IMG2 [IMG2_URL:$IMG2_URL]"
wget --quiet $IMG2_URL -O $IMG2

if [[ -f $IMG1 ]] && [[ -s $IMG1 ]] && [[ -f $IMG2 ]] && [[ -s $IMG2 ]]; then

	$FACESWAP_APP $IMG1 $IMG2 $OUTPUT_IMG

	if [[ -f $OUTPUT_IMG ]] && [[ -s $OUTPUT_IMG ]]; then
		errorMsg="SUCCESS: Swap completed [swap:$OUTPUT_IMG, shasum:$(shasum $OUTPUT_IMG)]"
	else
		errorMsg="FAILURE: Failed to create output image"
	fi

else
	errorMsg="FAILURE: 1 or more images couldn't be downloaded [IMG1_URL:$IMG1_URL, IMG2_URL:$IMG2_URL]"
fi

echo $errorMsg
echo $errorMsg >> $deterministFile

	


