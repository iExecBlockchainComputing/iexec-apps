FROM bshaffer/faceswap:latest
#https://github.com/bshaffer/faceswap-docker/blob/master/Dockerfile

COPY entrypoint.sh /entrypoint.sh
RUN apt update && apt install -y wget
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Build:
# docker image build -t iexechub/faceswap:1.0.0 .
# Usage: 
# docker run -it -v $(pwd)/iexec_out:/iexec_out iexechub/faceswap:1.0.0 https://somewhere.io/img1.jpg https://somewhere.io/img2.jpg
# docker run -it -v $(pwd)/iexec_out:/iexec_out iexechub/faceswap:1.0.0   (default images 2 images inside)