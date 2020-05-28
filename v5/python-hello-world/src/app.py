import os
import sys
import json
from pyfiglet import Figlet

iexec_out = os.environ['IEXEC_OUT']

# Do whatever you want
text = "Hello, World!"
if len(sys.argv) > 1:
    text = 'Hello, {}!'.format(sys.argv[1])

text = Figlet().renderText(text) + text # Let's add some art

with open(iexec_out + '/result.txt', 'w+') as fout:
    fout.write(text)
    print(text)

# Declare compute is over
with open(iexec_out + '/computed.json', 'w+') as f:
    json.dump({ "deterministic-output-path" : iexec_out + '/result.txt' }, f)

# Try: mkdir -p /tmp/iexec_out && IEXEC_OUT=/tmp/iexec_out python3 app.py Alice
