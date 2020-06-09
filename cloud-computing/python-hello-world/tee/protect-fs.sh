#!/bin/sh

cd $(dirname $0)

if [ ! -e Dockerfile ]
then
    printf "\nFailed to parse Dockerfile ENTRYPOINT\n"
    printf "Did you forget to add your Dockerfile in your build?\n"
    printf "COPY ./tee/Dockerfile /build/\n\n"
    exit 1
fi

ENTRYPOINT_ARSG=$(grep ENTRYPOINT ./Dockerfile | tail -1 |  grep -o '"[^"]\+"' | tr -d '"')
echo $ENTRYPOINT_ARSG > ./entrypoint

if [ -z "$ENTRYPOINT_ARSG" ]
then
    printf "\nFailed to parse Dockerfile ENTRYPOINT\n"
    printf "Did you forget to add an ENTRYPOINT to your Dockerfile?\n"
    printf "ENTRYPOINT [\"executable\", \"param1\", \"param2\"]\n\n"
    exit 1
fi

INTERPRETER=$(awk '{print $1}' ./entrypoint) # python
ENTRYPOINT=$(cat ./entrypoint) # /python /app/app.py

export SCONE_MODE=sim
export SCONE_HEAP=1G

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

scone fspf encrypt /fspf.pb > ./keytag

MRENCLAVE="$(SCONE_HASH=1 $INTERPRETER)"
FSPF_TAG=$(cat ./keytag | awk '{print $9}')
FSPF_KEY=$(cat ./keytag | awk '{print $11}')
FINGERPRINT="$FSPF_KEY|$FSPF_TAG|$MRENCLAVE|$ENTRYPOINT"
echo $FINGERPRINT > ./fingerprint

printf "\n\n"
printf "Your application fingerprint (mrenclave) is ready:\n"
printf "#####################################################################\n"
printf "iexec.json:\n\n"
printf "%s\n" "\"app\": { " " \"owner\" : ... " " \"name\": ... " "  ..." " \"mrenclave\": \"$FINGERPRINT\"" "}"
printf "#####################################################################\n"
printf "Hint: Replace 'mrenclave' before doing 'iexec app deploy' step.\n"
printf "\n\n"
