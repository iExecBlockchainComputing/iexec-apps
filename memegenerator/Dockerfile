FROM python:3.6-slim-stretch

RUN apt-get update -y
RUN apt-get install -y --fix-missing wkhtmltopdf xvfb zip libxrender-dev
RUN pip install imgkit

COPY src /src
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
