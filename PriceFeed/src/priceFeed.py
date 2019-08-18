#!/bin/python3

import datetime
import eth_abi
import json
import urllib.request
import sha3
import sys

root                = ''
inFolder            = '{}iexec_in/'.format(root)
outFolder           = '{}iexec_out/'.format(root)
determinismFilePath = '{}determinism.iexec'.format(outFolder)
callbackFilePath    = '{}callback.iexec'.format(outFolder)
errorFilePath       = '{}error.iexec'.format(outFolder)

datasetEnvVar       = 'IEXEC_DATASET_FILENAME'

DEFAULT_APIKEY = '65FFBB07-6119-4A1E-80DC-F46B4FF9EE2F';
# DEFAULT_APIKEY = '69CC0AA9-1E4D-4E41-806F-8C3642729B88';
# DEFAULT_APIKEY = 'D2C881D6-0BBF-4EFE-A572-AE6DB379D43E';
# DEFAULT_APIKEY = 'FB7B2516-70A1-42D8-8702-292F29F19768';

if __name__ == '__main__':

	# GET API KEY
	try:
		with open('{}{}'.format(inFolder, os.environ[datasetEnvVar]), 'r') as keyFile:
			apikey = keyFile.read()
	except:
		apikey = DEFAULT_APIKEY

	# GET PARAMS
	asset_id_base  = sys.argv[1] if len(sys.argv) > 1 else None
	asset_id_quote = sys.argv[2] if len(sys.argv) > 2 else None
	power          = sys.argv[3] if len(sys.argv) > 3 else None
	time           = sys.argv[4] if len(sys.argv) > 4 else None

	# FORMAT TIME
	try:
		time = datetime.datetime.utcfromtimestamp(int(time))
	except:
		try:
			time = datetime.datetime.fromisoformat(time)
		except:
			time = datetime.datetime.utcnow()

	try:
		# REQUEST
		host     = 'rest.coinapi.io'
		fragment = '&'.join('{}={}'.format(k,v) for k,v in {
			'time': time.isoformat()[0:23]+"Z"
		}.items())
		url      = 'https://{}/v1/exchangerate/{}/{}?{}'.format(host, asset_id_base, asset_id_quote, fragment)
		headers  = { 'X-CoinAPI-Key': apikey }
		data     = urllib.request.urlopen(urllib.request.Request(url, headers=headers)).read()
		results  = json.loads(data)

		# if 'error' in results:
		# 	raise urllib.request.HTTPError(url, 0, "invalid results", headers, None)

		timestamp = int(datetime.datetime.fromisoformat(results['time'][0:23]).timestamp()*1000)
		details   = '-'.join([ results['asset_id_base'], results['asset_id_quote'], power ]);
		value     = round(float(results['rate']) * 10 ** int(power))

		# ENCODE CALLBACK
		callback = eth_abi.encode_abi(['uint256', 'string', 'uint256'], [timestamp, details, value]).hex()
		with open(callbackFilePath, 'w') as callbackFile:
			callbackFile.write('0x{}'.format(callback))

		# GENERATE DETERMINISM
		determinism = sha3.keccak_256()
		determinism.update(bytes.fromhex(callback))
		with open(determinismFilePath, 'w') as determinismFile:
			determinismFile.write('0x{}'.format(determinism.hexdigest()))

		print('- Success: {} {} {}'.format(timestamp, details, value));

	except urllib.request.HTTPError as httperror:
		# STORE ERROR
		with open(errorFilePath, 'w') as errorFile:
			errorFile.write(str(httperror))

		# GENERATE DETERMINISM
		determinism = sha3.keccak_256()
		determinism.update(str(httperror).encode())
		with open(determinismFilePath, 'w') as determinismFile:
			determinismFile.write('0x{}'.format(determinism.hexdigest()))
