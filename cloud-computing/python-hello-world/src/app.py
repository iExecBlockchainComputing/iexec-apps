import os
import sys
import json
from pyfiglet import Figlet

iexec_out = os.environ['IEXEC_OUT']
iexec_in = os.environ['IEXEC_IN']

# Do whatever you want
text = "Hello, World!"
if len(sys.argv) > 1:
    text = 'Hello, {}!'.format(sys.argv[1])
text = Figlet().renderText(text) + text # Let's add some art for e.g.

# Eventually use some confidential assets
if os.path.exists(iexec_in + '/confidential-asset.txt'):
    with open(iexec_in + '/confidential-asset.txt', 'r') as f:
        text = text + '\nConfidential asset: ' + f.read()

# Append some results
with open(iexec_out + '/result.txt', 'w+') as f:
    f.write(text)
    print(text)

# Declare everything is computed
with open(iexec_out + '/computed.json', 'w+') as f:
    json.dump({ "deterministic-output-path" : iexec_out + '/result.txt' }, f)

## Try:
# Basic:
# mkdir -p /tmp/iexec_out && IEXEC_OUT=/tmp/iexec_out IEXEC_IN=/tmp/iexec_in python3 app.py Alice
#
# Tee:
# mkdir -p /tmp/iexec_out && IEXEC_OUT=/tmp/iexec_out IEXEC_IN=../tee/confidential-assets python3 app.py Alice
