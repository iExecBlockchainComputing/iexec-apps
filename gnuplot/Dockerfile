FROM ubuntu:18.04

RUN apt-get update -y && apt-get install -y gnuplot

COPY gnuplotPocoReady.sh /usr/bin/gnuplotPocoReady.sh
RUN chmod +x /usr/bin/gnuplotPocoReady.sh
ENTRYPOINT ["sh","-c","/usr/bin/gnuplotPocoReady.sh $0 $@"]
