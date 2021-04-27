FROM registry.scontain.com:5050/sconecuratedimages/crosscompilers

RUN mkdir /app
COPY ./src /app/

RUN apk update
RUN apk add go git curl
ENV SCONE_HEAP=1G
RUN go build -o /app/helloworld -compiler gccgo -buildmode=exe -gccgoflags -g /app/helloworld.go

###  protect file system with Scone with old procedure
COPY ./tee/protect-fs.sh ./tee/Dockerfile /build/
RUN sh /build/protect-fs.sh /app

ENTRYPOINT ["/app/helloworld"]
