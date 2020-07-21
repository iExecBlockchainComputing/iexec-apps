import os
import sys
import json
import eth_abi

iexec_out = os.environ['IEXEC_OUT']
iexec_in = os.environ['IEXEC_IN']

# Do whatever you want
data = "Hello, World!"
if len(sys.argv) > 1:
    data = 'Hello, {}!'.format(sys.argv[1])

# Eventually use some confidential assets
if os.path.exists(iexec_in + '/confidential-asset.txt'):
    with open(iexec_in + '/confidential-asset.txt', 'r') as f:
        print('Confidential asset: ' + f.read())

# Send callback data to smart-contract
callback_data = eth_abi.encode_abi([ 'string'], [ data ]).hex()
print('Offchain computing for Smart-Contracts [data:{}, callback_data:{}]'.format(data, callback_data))
with open(iexec_out + '/computed.json', 'w+') as f:
    json.dump({ "callback-data" : callback_data}, f)


## Try:
# Basic:
# mkdir -p /tmp/iexec_out && IEXEC_OUT=/tmp/iexec_out IEXEC_IN=/tmp/iexec_in python3 app.py Alice
#
# Tee:
# mkdir -p /tmp/iexec_out && IEXEC_OUT=/tmp/iexec_out IEXEC_IN=../tee/confidential-assets python3 app.py Alice
