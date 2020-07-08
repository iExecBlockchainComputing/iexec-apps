docker run --rm      -v /tmp/iexec_in:/iexec_in      -v /tmp/iexec_out:/iexec_out      -e IEXEC_IN=/iexec_in      -e IEXEC_OUT=/iexec_out gnuplot-v5  /iexec_in/gnuplot_sin_and_log.gp

