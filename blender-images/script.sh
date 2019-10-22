#!/bin/bash


# delete the consensus file if it already exists
rm /iexec/consensus.iexec 2> /dev/null

# run the rendering with iexec
/usr/local/blender/blender -b $1 -o iexec/output -f 1

# create the consensus file
cd iexec
echo "** Creation of the consensus file **"
convert output*.* -define png:include-chunk=none -set colorspace Gray -separate -average -depth 4 consensus.iexec
echo "Done!"
