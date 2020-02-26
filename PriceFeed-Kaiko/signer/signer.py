#!/usr/bin/python3

import hashlib
import json
import os
import pathlib
import traceback
import shutil
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



def isFile(filename):
	return pathlib.Path(filename).is_file()

def copytree(src, dst, symlinks=False, ignore=None):
	for item in os.listdir(src):
		s = os.path.join(src, item)
		d = os.path.join(dst, item)
		if os.path.isdir(s):
			shutil.copytree(s, d, symlinks, ignore)
		else:
			shutil.copy2(s, d)

def sha256sum(filename):
	h  = hashlib.sha256()
	b  = bytearray(128*1024)
	mv = memoryview(b)
	with open(filename, 'rb', buffering=0) as f:
		for n in iter(lambda : f.readinto(mv), 0):
			h.update(mv[:n])
	return h.hexdigest()

def sha256sumDir(path):
	filenames = sorted(str(filename) for filename in pathlib.Path(path).rglob('*') if isFile(filename))
	return hashlib.sha256('\n'.join('{} {}'.format(sha256sum(filename), filename) for filename in filenames).encode()).hexdigest()

class Signer:
	def __init__(self, key):
		self.pk = key;

	def signContribution(self, worker, taskid, digest):
		hash      = keccak256([            'bytes32', 'bytes32' ], [         taskid, digest ])
		seal      = keccak256([ 'address', 'bytes32', 'bytes32' ], [ worker, taskid, digest ])
		message   = keccak256([            'bytes32', 'bytes32' ], [         hash,   seal   ])
		signature = w3.eth.account.signHash(defunct_hash_message(message), private_key=self.pk).signature

		return {
			'result':     digest, # TODO: rename to resultDigest and notify core
			'resultHash': hash.hex(),
			'resultSalt': seal.hex(), # TODO: rename to resultSeal and notify core
			'signature':  signature.hex(),
		}



if __name__ == '__main__':

	try:
		# Copy everything from sconeDir to outputDir
		# shutil.copytree(sconeDir, outputDir, dirs_exist_ok=True)
		# workaround for 3.7 where "dirs_exist_ok" is not available
		copytree(sconeDir, outputDir)

		# If callback, compute custom digest overload determinism
		if isFile('{path}{file}'.format(path=sconeDir, file=callbackFile)):
			with open('{path}{file}'.format(path=sconeDir, file=callbackFile), 'r') as file:
				digest = keccak256([ 'bytes' ], [ file.read() ]).hex()
			with open('{path}{file}'.format(path=outputDir, file=determinismFile), 'w') as file:
				file.write(digest)

		# Else, if determinism, get app specific digest
		elif isFile('{path}{file}'.format(path=sconeDir, file=determinismFile)):
			with open('{path}{file}'.format(path=sconeDir, file=determinismFile), 'r') as file:
				digest = file.read()

		# Else, compute digest from files
		else:
			digest = '0x{}'.format(sha256sumDir(sconeDir))

		with open('{path}{file}'.format(path=outputDir, file=enclaveSigFile), 'w') as file:
			file.write(json.dumps(
				Signer(os.environ.get('enclave_key')).signContribution(
					worker = os.environ.get('worker'),
					taskid = os.environ.get('taskid'),
					digest = digest
				)
			))

	except Exception as ex:
		traceback.print_exc()
		print(ex)
