#!/bin/bash


export SCONE_MODE=sim
export SCONE_HEAP=1G
export SCONE_ALPINE=1

APP_FOLDER=$1

printf "\n### Starting file system protection ...\n\n"

scone fspf create /fspf.pb
scone fspf addr /fspf.pb /          --not-protected --kernel /
scone fspf addr /fspf.pb /usr       --authenticated --kernel /usr
scone fspf addf /fspf.pb /usr       /usr
scone fspf addr /fspf.pb /bin       --authenticated --kernel /bin
scone fspf addf /fspf.pb /bin       /bin
scone fspf addr /fspf.pb /lib       --authenticated --kernel /lib
scone fspf addf /fspf.pb /lib       /lib
scone fspf addr /fspf.pb /etc/ssl   --authenticated --kernel /etc/ssl
scone fspf addf /fspf.pb /etc/ssl   /etc/ssl
scone fspf addr /fspf.pb /sbin      --authenticated --kernel /sbin
scone fspf addf /fspf.pb /sbin      /sbin
printf "\n### Protecting code found in folder \"$APP_FOLDER\"\n\n"
scone fspf addr /fspf.pb $APP_FOLDER --authenticated --kernel $APP_FOLDER
scone fspf addf /fspf.pb $APP_FOLDER $APP_FOLDER

scone fspf encrypt /fspf.pb > /keytag

INTERPRETER=$(awk '{print $1}' /entrypoint.sh)
ENTRYPOINT=$(cat /entrypoint.sh)
MRENCLAVE="$(SCONE_HASH=1 $INTERPRETER)"
FSPF_TAG=$(cat /keytag | awk '{print $9}')
FSPF_KEY=$(cat /keytag | awk '{print $11}')
FINGERPRINT="$FSPF_KEY|$FSPF_TAG|$MRENCLAVE|$ENTRYPOINT"

printf "\n\n"
printf "#####################################################################\n"
printf "Application's fingerprint (use this when deploying your app onchain):\n"
printf "<mrenclave>$FINGERPRINT</mrenclave>\n"
printf "#####################################################################\n"
printf "\n\n"
