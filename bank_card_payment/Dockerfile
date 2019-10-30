FROM python:3.7-alpine
COPY test_dwolla.py /test_dwolla.py
COPY requirements.txt /requirements.txt
RUN pip install -r /requirements.txt
RUN chmod +x /test_dwolla.py
ENTRYPOINT ["/test_dwolla.py"]