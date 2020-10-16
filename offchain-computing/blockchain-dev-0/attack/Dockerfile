FROM python:3.9.0-alpine3.12

# prepare tooling
RUN apk add gcc musl-dev

# pip dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy app
COPY ./src /app

ENTRYPOINT [ "python", "/app/run.py" ]
