import os
import sys
import json


print("Started compute hello-with-callback")

iexec_out = os.environ['IEXEC_OUT']
computed_json_file = iexec_out + '/computed.json'

iexec_out_dir = os.path.join(iexec_out)
if not os.path.exists(iexec_out_dir):
    os.mkdir(iexec_out_dir)

hexChar = "a"
if len(sys.argv) > 1:
    hexChar = sys.argv[1]
callback_data = '0x000000000000000000000000000000000000000000000000000000000000000{}'.format(hexChar)

with open(computed_json_file, 'w+') as f:
    computed_json = { "callback-data" : callback_data}
    json.dump(computed_json, f)
    print(computed_json)

print("Ended compute hello-callback ")