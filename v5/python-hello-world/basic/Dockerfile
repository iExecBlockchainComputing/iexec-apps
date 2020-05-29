FROM python:3.7.3

### install some python3 dependencies
RUN pip3 install pyfiglet

COPY ./src /app

ENTRYPOINT ["python", "/app/app.py"]
