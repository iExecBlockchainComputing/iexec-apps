#!/usr/bin/python3

import datetime
import eth_abi
import json
import jsonpath_rw
import os
import re
import sha3
import sys
import urllib.request

root         = '/'
inputDir     = '{}iexec_in/'.format(root)
outputDir    = '{}scone/'.format(root)
callbackFile = 'callback.iexec'

class Lib:
	def parseValue(rawValue, ethType, power):
		if re.search('^u?int[0-9]*$', ethType):
			return round(float(rawValue) * 10 ** int(power))
		else:
			return rawValue

	def formatArgs(args):
		return '&'.join('{}={}'.format(k,v) for k,v in args.items())

	def getAPIKey():
		# Dataset file is a zip that is extracted before the entrypoint. read the key.txt file extracted from it
		# file = os.environ.get('IEXEC_DATASET_FILENAME')
		file = 'key.txt'
		path = '{root}{file}'.format(root=inputDir, file=file)
		try:
			with open(path, 'r') as file:
				apiKey = file.read().strip()
				if not re.search('^[0-9a-zA-Z]{1,128}$', apiKey):
					raise Exception('Invalid API key')
				return apiKey
		except FileNotFoundError:
			raise Exception('Missing API key dataset')

	def fetchMarketData(region, endpoint, params):
		print('Request https://{region}.market-api.kaiko.io/v1/data/trades.v1/{endpoint}?{params}'.format(
			region   = region,
			endpoint = endpoint,
			params   = params,
		))
		return json.loads(
			urllib.request.urlopen(
				urllib.request.Request(
					'https://{region}.market-api.kaiko.io/v1/data/trades.v1/{endpoint}?{params}'.format(
						region   = region,
						endpoint = endpoint,
						params   = params,
					),
					headers = {
						'X-Api-Key': Lib.getAPIKey(),
						'User-Agent': 'Kaiko iExec Adapter',
					}
				)
			).read()
		)

class PriceFeed:
	def fetchRate(baseAsset, quoteAsset):
		return Lib.fetchMarketData(
			'us',
			'spot_direct_exchange_rate/{baseAsset}/{quoteAsset}/recent'.format(baseAsset=baseAsset, quoteAsset=quoteAsset),
			Lib.formatArgs({
				'interval': '1m',
				'limit':    720,
			})
		)

	def run(baseAsset, quoteAsset, power):
		response = PriceFeed.fetchRate(
			baseAsset  = baseAsset,
			quoteAsset = quoteAsset,
		)
		try:
			data      = response.get('data')[0]
			timestamp = data.get('timestamp')
			details   = '-'.join([ baseAsset, quoteAsset, power ])
			rawValue  = data.get('price')
			value     = Lib.parseValue(rawValue, 'uint256', power)
			return (timestamp, details, value)
		except Exception as e:
			raise Exception('API response parsing failure: {}'.format(e))


# Example usage:
# btc usd 9
if __name__ == '__main__':
	print('PriceFeed started')
	try:
		# EXECUTE CALL
		result = PriceFeed.run(
			baseAsset  = sys.argv[1],
			quoteAsset = sys.argv[2],
			power      = sys.argv[3],
		)
		print('- Success: {} {} {}'.format(*result))

		# GENERATE CALLBACK
		callback = eth_abi.encode_abi([ 'uint256', 'string', 'uint256' ], [ *result ]).hex()
		with open('{path}{file}'.format(path=outputDir, file=callbackFile), 'w') as file:
			file.write('0x{}'.format(callback))

	except IndexError as e:
		print('Error: missing arguments')

	except Exception as e:
		print('Execution Failure: {}'.format(e))

	print('PriceFeed completed')
