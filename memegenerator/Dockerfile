FROM ubuntu:18.04

RUN apt-get update -y
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y python3 python3-pip xvfb wkhtmltopdf zip
RUN pip3 install imgkit

COPY src /src
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
