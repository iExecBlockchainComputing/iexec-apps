FROM reckey/signature:test1
COPY signature.py /app/signature.py
RUN pip install web3
CMD ["python", "/app/signature.py"]

# docker image build -t iexechub/tee-signature .
# docker run -it -e TASKID=0x8b43265c231bd32d1b249c1ce58bf0c77a9ebc6a30da37e961063a073a921e06 -e WORKER=0x1a69b2EB604dB8eBa185dF03ea4F5288dcbbD248 iexechub/tee-signature python /app/signature.py
