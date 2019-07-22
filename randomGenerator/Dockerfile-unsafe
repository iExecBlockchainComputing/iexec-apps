FROM python:3.6-alpine

RUN apk --no-cache add --virtual .builddeps gcc musl-dev
RUN pip install pysha3
RUN apk del .builddeps
RUN rm -rf /root/.cache

COPY src /app

ENTRYPOINT [ "python3", "/app/randomGenerator.py" ]
