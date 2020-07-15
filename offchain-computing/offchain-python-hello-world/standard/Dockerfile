FROM python:3.7.3-alpine3.10

### install some python3 dependencies
RUN apk add gcc musl-dev
RUN pip3 install eth_abi

COPY ./src /app

ENTRYPOINT ["python", "/app/app.py"]
