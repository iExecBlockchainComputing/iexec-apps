FROM alpine:3.7 as build

ENV XMRIG_DIR /xmrig-cpu
ENV XMRIG_BUILD_DIR $XMRIG_DIR/build

RUN apk --no-cache add build-base cmake curl git libuv-dev wget
RUN git clone https://github.com/xmrig/xmrig.git $XMRIG_DIR && cd $XMRIG_DIR
RUN mkdir $XMRIG_BUILD_DIR && cd $XMRIG_BUILD_DIR && \
    cmake .. -DWITH_HTTPD=OFF && make
RUN mv $XMRIG_BUILD_DIR/xmrig /usr/bin/

FROM alpine:3.7
RUN apk --no-cache add libuv-dev
COPY --from=build /usr/bin/xmrig /usr/bin/

# DL entrypoint script
COPY ./entrypoint.sh entrypoint.sh
#RUN wget https://raw.githubusercontent.com/Hugogerva/xmrig-docker-script/master/entrypoint.sh
RUN mv /entrypoint.sh /usr/local/bin/xmrig.sh
RUN chmod +x /usr/local/bin/xmrig.sh

ENTRYPOINT ["sh","-c","/usr/local/bin/xmrig.sh $0 $@"]]
