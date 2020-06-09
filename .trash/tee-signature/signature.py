#!/usr/bin/python3
import shutil
import json
import os

from py_essentials.hashing import fileChecksum
from web3.auto             import w3

### DEBUG
# enclave private = "0x564a9db84969c8159f7aa3d5393c5ecd014fce6a375842a45b12af6677b12407"
# enclave address = 0x3cB738D98D7A70e81e81B0811Fae2452BcA049Bc
# digest    = w3.soliditySha3([ 'string' ], [ 'iExec the wanderer' ]).hex()

if __name__ == '__main__':

	taskid  = os.environ.get('TASKID' ) # or '0x8b43265c231bd32d1b249c1ce58bf0c77a9ebc6a30da37e961063a073a921e06'
	worker  = os.environ.get('WORKER' ) # or '0x748e091bf16048cb5103E0E10F9D5a8b7fBDd860'
	keyfile = os.environ.get('KEYFILE') or '/app/priv_key'

	if not taskid:               raise ValueError('Missing TASKID')
	if not w3.isAddress(worker): raise ValueError('Invalid worker address')

	worker = w3.toChecksumAddress(worker)

	print("Genrating result and consensus.iexec in /iexec ...")
	shutil.copy("/app/result.txt", "/iexec/result.txt")
	shutil.copy("/app/result.txt", "/iexec/consensus.iexec")

	with open(keyfile) as f:
		private = f.read().splitlines()[0]

	digest    = "0x" + fileChecksum("/iexec/consensus.iexec", "sha256") # hexstring
	hash      = w3.soliditySha3([            'bytes32', 'bytes32' ], [         taskid, digest ])
	seal      = w3.soliditySha3([ 'address', 'bytes32', 'bytes32' ], [ worker, taskid, digest ])
	contrib   = w3.soliditySha3([            'bytes32', 'bytes32' ], [           hash,   seal ])
	message   = w3.soliditySha3([ 'bytes' ], [ b'\x19Ethereum Signed Message:\n32' + contrib ])
	signature = w3.eth.account.signHash(message, private)

	with open("/iexec/enclaveSig.iexec", 'w') as f:
		json.dump({
			'digest': digest,
			'hash':   w3.toHex(hash),
			'seal':   w3.toHex(seal),
			'sign':
			{
				'v': signature.v,
				'r': w3.toHex(signature.r),
				's': w3.toHex(signature.s)
			}
		}, f, ensure_ascii=False)

	print("------ Additional log -------")
	print("Listing files in /iexec:")
	for entry in os.listdir("/iexec"):
		print("- {}".format(entry))
	print("Content of /iexec/enclaveSig.iexec")
	with open("/iexec/enclaveSig.iexec") as f:
		for line in f:
			print(f, end='')
