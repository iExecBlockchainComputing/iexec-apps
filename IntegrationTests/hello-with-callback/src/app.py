import os
import sys
from web3.auto import w3

print("Started compute hello-with-callback")

dir = os.path.join("/iexec_out")
if not os.path.exists(dir):
    os.mkdir(dir)

hexChar = "a"

if len(sys.argv) > 1:
    hexChar = sys.argv[1]

with open("iexec_out/callback.iexec", "w+") as fout:
   callback = '0x000000000000000000000000000000000000000000000000000000000000000{}'.format(hexChar)
   fout.write(callback)
   print('Callback: {} (written to callback.iexec)'.format(callback))
   digest = keccak256([ 'bytes' ], [ callback ]).hex()
   print('Digest: {} (not written, but should match reveal `resultDigest`)'.format(digest))

# touch 'completed-compute.iexec' file at end of compute
open('/iexec_out/completed-compute.iexec', 'a').close()

print("Ended compute hello-callback")
