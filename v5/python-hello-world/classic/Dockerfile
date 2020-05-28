FROM python:3.7.3

### install python3 dependencies
RUN pip3 install pyfiglet

### copy the code inside the image
COPY src /app
COPY classic/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
