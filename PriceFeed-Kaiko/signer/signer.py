#!/usr/bin/python3

import json
import os
import pathlib
import traceback
from web3.auto import w3
from eth_account.messages import defunct_hash_message

keccak256 = w3.soliditySha3

# FOR DEBUGING
# os.environ['enclave_key'] = '0x912cf4c9298141d745320abdb656c27d58778a5b2d4290186c0185ed9acda6d6'
# os.environ['taskid']      = '0x171d4a18b30912aaef6c0baa08027607b9359fe1afbe4b4b158e829acd29aa12'
# os.environ['worker']      = '0x1cb25226FeCeE496f246DDd1D735276B2E168B5a'

root            = '/'
sconeDir        = '{}scone/'.format(root)
outputDir       = '{}iexec_out/'.format(root)
callbackFile    = 'callback.iexec'
determinismFile = 'determinism.iexec'
enclaveSigFile  = 'enclaveSig.iexec'



def isFile(path):
	return pathlib.Path(path).is_file()

class Signer:
	def __init__(self, key):
		self.pk = key;

	def signContribution(self, worker, taskid, digest):
		hash      = keccak256([            'bytes32', 'bytes32' ], [         taskid, digest ])
		seal      = keccak256([ 'address', 'bytes32', 'bytes32' ], [ worker, taskid, digest ])
		message   = keccak256([            'bytes32', 'bytes32' ], [         hash,   seal   ])
		signature = w3.eth.account.signHash(defunct_hash_message(message), private_key=self.pk).signature

		return {
			'resultDigest': digest,
			'resultHash':   hash.hex(),
			'resultSalt':   seal.hex(), # TODO: rename and notify core
			'signature':    signature.hex(),
		}



if __name__ == '__main__':

	try:
		if isFile('{path}{file}'.format(path=sconeDir, file=callbackFile)):
			with open('{path}{file}'.format(path=sconeDir, file=callbackFile), 'r') as file:
				callback = file.read()
				digest   = keccak256([ 'bytes' ], [ callback ]).hex()

		elif isFile('{path}{file}'.format(path=sconeDir, file=determinismFile)):
			with open('{path}{file}'.format(path=sconeDir, file=determinismFile), 'r') as file:
				callback = None
				digest   = file.read()

		else:
			raise Exception('ERROR: no callback and no determinism available')

		data = Signer(os.environ['enclave_key']).signContribution(
			worker = os.environ['worker'],
			taskid = os.environ['taskid'],
			digest = digest
		)

		if callback:
			with open('{path}{file}'.format(path=outputDir, file=callbackFile), 'w') as file:
				file.write(callback)

		with open('{path}{file}'.format(path=outputDir, file=determinismFile), 'w') as file:
			file.write(digest)

		with open('{path}{file}'.format(path=outputDir, file=enclaveSigFile), 'w') as file:
			file.write(json.dumps(data))


	except Exception as ex:
		traceback.print_exc()
		print(ex)
