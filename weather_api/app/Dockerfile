FROM jfloff/alpine-python
COPY config.ini /config.ini
COPY darkskyp_api_call.py /darkskyp_api_call.py
COPY requirements.txt /requirements.txt
RUN pip install -r /requirements.txt
RUN chmod +x /darkskyp_api_call.py
ENTRYPOINT ["/darkskyp_api_call.py"]