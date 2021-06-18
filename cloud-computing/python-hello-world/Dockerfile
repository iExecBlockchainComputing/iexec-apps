FROM python:3.7-alpine3.10

### install needed python3 dependencies
RUN pip3 install pyfiglet

COPY ./src /app

ENTRYPOINT ["python3", "/app/app.py"]
