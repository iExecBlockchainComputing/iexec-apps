FROM registry.scontain.com:5050/sconecuratedimages/crosscompilers:latest-scone3.0.0

RUN apk --update add go=1.9.4-r0 git curl

COPY ./src /app

RUN go build -o /app/helloworld -compiler gccgo -buildmode=exe -gccgoflags -g /app/helloworld.go

###  protect file system with Scone with old procedure
COPY ./tee/protect-fs.sh ./tee/Dockerfile /build/
RUN sh /build/protect-fs.sh /app

ENTRYPOINT ["/app/helloworld"]
