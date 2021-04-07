import eth_abi
import json
import os
import re
import sys
import urllib.request

iexec_out = os.environ['IEXEC_OUT']
iexec_in = os.environ['IEXEC_IN']
dataset_filepath = iexec_in + '/' + os.environ['IEXEC_DATASET_FILENAME']

class Lib:
	@staticmethod
	def parseValue(rawValue, ethType, power):
		if re.search('^u?int[0-9]*$', ethType):
			return round(float(rawValue) * 10 ** int(power))
		else:
			return rawValue

	@staticmethod
	def formatArgs(args):
		return '&'.join('{}={}'.format(k,v) for k,v in args.items())

	@staticmethod
	def getAPIKey():
		try:
			with open(dataset_filepath, 'r') as dataset_file:
				apiKey = dataset_file.read().strip()
				if not re.search('^[0-9a-zA-Z]{1,128}$', apiKey):
					raise Exception('Invalid API key')
				return apiKey
		except (FileNotFoundError, IsADirectoryError):
			raise Exception('Missing API key dataset')

	@staticmethod
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
	@staticmethod
	def fetchRate(baseAsset, quoteAsset):
		return Lib.fetchMarketData(
			'us',
			'spot_direct_exchange_rate/{baseAsset}/{quoteAsset}/recent'.format(baseAsset=baseAsset, quoteAsset=quoteAsset),
			Lib.formatArgs({
				'interval': '1m',
				'limit':    720,
			})
		)

	@staticmethod
	def run(baseAsset, quoteAsset, power):
		response = PriceFeed.fetchRate(
			baseAsset  = baseAsset,
			quoteAsset = quoteAsset,
		)
		try:
			data      = response.get('data')[0]
			timestamp = data.get('timestamp')
			details   = 'Price-{base}/{quote}-{power}'.format(base=baseAsset.upper(), quote=quoteAsset.upper(), power=power)
			rawValue  = data.get('price')
			value     = Lib.parseValue(rawValue, 'uint256', power)
			return (timestamp, details, value)
		except Exception as e:
			raise Exception('API response parsing failure: {}'.format(e))


# Example usage:
# btc usd 9
if __name__ == '__main__':
	print('PriceFeed started')
	success = False
	data = (0, '', 0) # default returned value to avoid attack on scheduler

	try:
		# EXECUTE CALL
		data = PriceFeed.run(
			baseAsset  = sys.argv[1],
			quoteAsset = sys.argv[2],
			power      = sys.argv[3],
		)
		success = True
		print('- Success: {} {} {}'.format(*data))

	except IndexError as e:
		print('Error: missing arguments')

	except Exception as e:
		print('Execution Failure: {}'.format(e))

	# GENERATE CALLBACK
	callback_data = eth_abi.encode_abi(['uint256', 'string', 'uint256'], [*data]).hex()
	callback_data = '0x{}'.format(callback_data)
	print('Offchain Computing for Smart-Contracts [data:{}, callback_data:{}]'.format(data, callback_data))

	with open(iexec_out + '/computed.json', 'w+') as f:
		json.dump({ "callback-data" : callback_data}, f)

	if success:
		print('PriceFeed completed')
	else:
		print('PriceFeed failed')