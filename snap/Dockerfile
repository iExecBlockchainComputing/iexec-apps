FROM mrmoor/esa-snap

RUN apt-get install unzip
COPY processDataset.sh processDataset.sh

RUN chmod +x processDataset.sh

ENTRYPOINT ["sh","-c","./processDataset.sh $@"]]
