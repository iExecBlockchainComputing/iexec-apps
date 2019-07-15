FROM jrottenberg/ffmpeg:4.0-scratch AS ffmpeg
FROM python:3.6
COPY --from=ffmpeg / /
COPY ffmpegPoCoReady.sh /usr/bin/ffmpegPoCoReady.sh
RUN chmod +x /usr/bin/ffmpegPoCoReady.sh
ENTRYPOINT ["sh","-c","/usr/bin/ffmpegPoCoReady.sh $0 $@"]
