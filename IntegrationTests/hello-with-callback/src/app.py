import os

print("Started compute hello-with-callback")

dir = os.path.join("/iexec_out")
if not os.path.exists(dir):
    os.mkdir(dir)

with open("iexec_out/callback.iexec", "w+") as fout:
   resultTxt = "0x0000000000000000000000000000000000000000000000000000000000abcdef0000000000000000000000000000000000000000000000000000000000abcdef"
   print(resultTxt)
   fout.write(resultTxt)

# touch 'completed-compute.iexec' file at end of compute
open('/iexec_out/completed-compute.iexec', 'a').close()

print("Ended compute hello-callback")
