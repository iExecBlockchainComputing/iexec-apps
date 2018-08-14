#!/bin/sh
# enable next line for debugging purpose
# set -x

# inspired from this example :https://senbox.atlassian.net/wiki/spaces/SNAP/pages/70503475/Bulk+Processing+with+GPT

############################################
# User Configuration
############################################

# adapt this path to your needs
#export PATH=~/progs/snap/bin:$PATH
gptPath="gpt"



############################################
# Command line handling
############################################




if [ "$#" -ne 3 ]; then
    echo "Illegal number of parameters. Must be 3 => 1:graphXmlURL,2:parameterFileURL,3:inputDatasetURL "
    exit 1
fi

# first parameter is a url to the graph xml
graphXmlURL="$1"

# second parameter is a url to a parameter file
parameterFileURL="$2"

# use third parameter for url to dataset zip products
inputDatasetURL="$3"



############################################
# Helper functions
############################################
removeExtension() {
    file="$1"
    echo "$(echo "$file" | sed -r 's/\.[^\.]*$//')"
}


############################################
# Main processing
############################################

############################################
# Check all URLS
############################################
wget -q --spider $graphXmlURL
if [ $? -ne 0 ]
then
  echo " url $graphXmlURL not available"
  exit 1
fi

wget -q --spider $parameterFileURL
if [ $? -ne 0 ]
then
  echo " url $parameterFileURL not available"
  exit 1
fi

wget -q --spider $inputDatasetURL
if [ $? -ne 0 ]
then
  echo " url $inputDatasetURL not available"
  exit 1
fi

############################################
# Download all inputs
############################################

wget $graphXmlURL -O graphXml.xml

if [ ! -f graphXml.xml ]
then
  echo "graphXml.xml file not found after wget on $graphXmlURL"
  exit 1
fi


wget $parameterFileURL -O parameters.properties

if [ ! -f parameters.properties ]
then
  echo "parameters.properties file not found after wget on $parameterFileURL"
  exit 1
fi

wget $inputDatasetURL -O input.zip

if [ ! -f input.zip ]
then
  echo "input.zip file not found after wget on $parameterFileURL"
  exit 1
fi

############################################
# Prepare directories
############################################

mkdir -p /iexec/


mkdir -p /input
mv input.zip /input

cd /input
echo "unzipping input"
unzip input.zip
if [ $? -eq 0 ]
then
    echo "unzip success"
else
    echo "unzip failed"
    exit 1
fi
cd -

mkdir -p /iexec/output

# the d option limits the elemeents to loop over to directories. Remove it, if you want to use files.
for F in $(ls -1d /input/S2*.SAFE); do
  sourceFile="$(realpath "$F")"
  targetFile="/iexec/output/$(removeExtension "$(basename ${F})").dim"
  ${gptPath} graphXml.xml -e -p parameters.properties -t ${targetFile} ${sourceFile}
done

#generate /iexec/consensus.iexec
rm -f /iexec/consensus.iexec
touch /iexec/consensus.iexec


cat graphXml.xml >> /iexec/consensus.iexec
cat parameters.properties >> /iexec/consensus.iexec
echo $inputDatasetURL >> /iexec/consensus.iexec

nbFiles=$(find /iexec/output -type f | wc -l)
echo "outputs files number : " >> /iexec/consensus.iexec
echo $nbFiles >> /iexec/consensus.iexec
