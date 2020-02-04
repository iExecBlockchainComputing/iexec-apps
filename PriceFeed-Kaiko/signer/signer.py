#!/usr/bin/python3

import json
import os
import traceback
from web3.auto import w3
from eth_account.messages import defunct_hash_message

keccak256 = w3.soliditySha3

# FOR DEBUGING
# os.environ['enclave_key'] = "0x912cf4c9298141d745320abdb656c27d58778a5b2d4290186c0185ed9acda6d6"
# os.environ['taskid']      = "0x171d4a18b30912aaef6c0baa08027607b9359fe1afbe4b4b158e829acd29aa12"
# os.environ['worker']      = "0x1cb25226FeCeE496f246DDd1D735276B2E168B5a"

root            = '/'
sconeDir        = '{}scone/'.format(root)
outputDir       = '{}iexec_out/'.format(root)
callbackFile    = 'callback.iexec'
determinismFile = 'determinism.iexec'
enclaveSigFile  = 'enclaveSig.iexec'

class Signer:
	def __init__(self, key):
		self.pk = key;

	def signContribution(self, worker, taskid, resultDigest):
		resultHash = keccak256([            "bytes32", "bytes32" ], [         taskid, resultDigest ])
		resultSeal = keccak256([ "address", "bytes32", "bytes32" ], [ worker, taskid, resultDigest ])
		signature = w3.eth.account.signHash(
			defunct_hash_message(keccak256([ "bytes32", "bytes32" ], [ resultHash, resultSeal ])),
			private_key=self.pk
		).signature

		return {
			'resultDigest': resultDigest.hex(),
			'resultHash':   resultHash.hex(),
			'resultSalt':   resultSeal.hex(), # TODO: rename and notify core
			'signature':    signature.hex(),
		}

if __name__ == '__main__':

	try:

		with open('{path}{file}'.format(path=sconeDir, file=callbackFile), 'r') as file:
			callback = file.read()

		data = Signer(os.environ['enclave_key']).signContribution(
			worker       = os.environ['worker'],
			taskid       = os.environ['taskid'],
			resultDigest = keccak256([ "bytes"], [ callback ])
		)

		with open('{path}{file}'.format(path=outputDir, file=callbackFile), 'w') as file:
			file.write(callback)

		with open('{path}{file}'.format(path=outputDir, file=determinismFile), 'w') as file:
			file.write(data['resultDigest'])

		with open('{path}{file}'.format(path=outputDir, file=enclaveSigFile), 'w') as file:
			file.write(json.dumps(data))

	except Exception as ex:
		traceback.print_exc()
		print(ex)
