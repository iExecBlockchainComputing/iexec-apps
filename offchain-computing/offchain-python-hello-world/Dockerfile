FROM python:3.7-alpine3.10

### install needed python3 dependencies
# RUN apk add gcc musl-dev
RUN pip3 install eth_abi

COPY ./src /app

ENTRYPOINT ["python", "/app/app.py"]
