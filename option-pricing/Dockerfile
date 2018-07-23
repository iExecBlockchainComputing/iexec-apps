FROM python:3.7.0-alpine3.8
RUN apk --no-cache add --virtual .builddeps gcc gfortran musl-dev && pip install numpy==1.14.5 && apk del .builddeps && rm -rf /root/.cache

COPY option-pricing.py option-pricing.py

ENTRYPOINT ["python", "option-pricing.py"]
