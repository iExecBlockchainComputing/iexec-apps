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

root                = ''
inFolder            = '{}iexec_in/'.format(root)
outFolder           = '{}scone/'.format(root)
callbackFilePath    = '{}callback.iexec'.format(outFolder)
determinismFilePath = '{}determinism.iexec'.format(outFolder)

class Lib:
	def parseValue(rawValue, ethType, power):
		if re.search('^u?int[0-9]*$', ethType):
			return round(float(rawValue) * 10 ** int(power))
		else:
			return rawValue

	def formatArgs(args):
		return '&'.join('{}={}'.format(k,v) for k,v in args.items())

	def getAPIKey():
		file = 'key.txt'
		path = '{root}/{file}'.format(root=inFolder, file=file)
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
				'limit':  	720,
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


class Entrypoints:
	pricefeed = PriceFeed.run

# Example usage:
# pricefeed btc usd 9
if __name__ == '__main__':
	print("PriceFeed started")
	try:
		# EXECUTE CALL
		(timestamp, details, value) = PriceFeed.run(
			baseAsset  = sys.argv[2],
			quoteAsset = sys.argv[3],
			power      = sys.argv[4],
		)
		print('- Success: {} {} {}'.format(timestamp, details, value))

		# GENERATE CALLBACK
		callback = eth_abi.encode_abi(['uint256', 'string', 'uint256'], [timestamp, details, value]).hex()
		with open(callbackFilePath, 'w') as callbackFile:
			callbackFile.write('0x{}'.format(callback))

		# GENERATE DETERMINISM
		determinism = sha3.keccak_256()
		determinism.update(bytes.fromhex(callback))
		with open(determinismFilePath, 'w') as determinismFile:
			determinismFile.write('0x{}'.format(determinism.hexdigest()))

	except AttributeError as e:
		print('Error: Invalid appName {}'.format(sys.argv[1]))
		print(e)

	except IndexError as e:
		print('Error: missing arguments')

	except Exception as e:
		print('Execution Failure: {}'.format(e))

	print("PriceFeed completed")
