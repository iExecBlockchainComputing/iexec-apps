# same version as Scone
FROM golang:1.9.4-alpine3.7

RUN apk --update add go=1.9.4-r0 git curl

COPY ./src /app

RUN go build -o /app/helloworld -buildmode=exe -gccgoflags -g /app/helloworld.go

ENTRYPOINT ["/app/helloworld"]
