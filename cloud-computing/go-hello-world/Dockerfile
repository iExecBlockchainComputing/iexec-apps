# same version as Scone
FROM golang:1.16.0-alpine3.13

RUN apk --update add gcc build-base gcc-go

COPY ./src /app

RUN go build -compiler=gccgo -buildmode=exe -o /app/helloworld /app/helloworld.go

ENTRYPOINT ["/app/helloworld"]
