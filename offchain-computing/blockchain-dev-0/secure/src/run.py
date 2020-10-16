import eth_abi
import json
import os
import random
import time
import sys

OUTDIR = os.environ['IEXEC_OUT']

if __name__ == '__main__':

	print('Oracle started')
	data = (0, 0)
	success = False

	try:
		data = ( int(time.time()), random.randrange(990, 1011) )
		success = True

	except IndexError as e:
		print('Error: missing arguments')

	except Exception as e:
		print('Execution Failure: {}'.format(e))

	callback_data = eth_abi.encode_abi(['uint256', 'uint256'], [*data]).hex()
	callback_data = '0x{}'.format(callback_data)
	print('Offchain Computing for Smart-Contracts [data:{}, callback_data:{}]'.format(data, callback_data))

	output = '{path}/{filename}'.format(path=OUTDIR, filename='computed.json')
	with open(output, 'w+') as f:
		json.dump({ 'callback-data' : callback_data}, f)

	print('Oracle completed' if success else 'Oracle failed')
