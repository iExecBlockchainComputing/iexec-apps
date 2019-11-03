FROM jfloff/alpine-python
COPY config.ini /config.ini
COPY openweathermap_api_call.py /openweathermap_api_call.py
RUN chmod +x /openweathermap_api_call.py
ENTRYPOINT ["/openweathermap_api_call.py"]