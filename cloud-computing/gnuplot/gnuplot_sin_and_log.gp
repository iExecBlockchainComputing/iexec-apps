set terminal png
set output "/iexec_out/sin_and_log.png"
set multiplot
set size 1, 0.5
set origin 0.0,0.5
plot sin(x), log(x)

