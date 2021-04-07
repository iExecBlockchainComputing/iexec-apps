import os
import sys
import json
from pyfiglet import Figlet

iexec_out = os.environ['IEXEC_OUT']
iexec_in = os.environ['IEXEC_IN']
dataset_filepath = iexec_in + '/' + os.environ['IEXEC_DATASET_FILENAME']

# Do whatever you want
text = "Hello, World!"
if len(sys.argv) > 1:
    text = 'Hello, {}!'.format(sys.argv[1])
text = Figlet().renderText(text) + text # Let's add some art for e.g.

# Eventually use a dataset (public with Standard mode and confidential with TEE mode)
if os.path.isfile(dataset_filepath):
    with open(dataset_filepath, 'r') as f:
        text = text + '\nDataset ({}): {}'.format(dataset_filepath, f.read())

# Append some results
with open(iexec_out + '/result.txt', 'w+') as f:
    f.write(text)
    print(text)

# Declare everything is computed
with open(iexec_out + '/computed.json', 'w+') as f:
    json.dump({ "deterministic-output-path" : iexec_out + '/result.txt' }, f)
