#!/usr/bin/python3

import os
import random
import sha3
import sys

root                = ''
inFolder            = '{}iexec_in/'.format(root)
outFolder           = '{}scone/'.format(root)
callbackFilePath    = '{}callback.iexec'.format(outFolder)
determinismFilePath = '{}determinism.iexec'.format(outFolder)

datasetLocationEnvvar = 'IEXEC_INPUT_FILES_FOLDER'
datasetFilenameEnvvar = 'IEXEC_DATASET_FILENAME'

if __name__ == '__main__':

	# Seed using the arguments → still not deterministic event with arguments
	random.seed(" ".join(sys.argv), random.random())

	# OPTIONAL: reseed using dataset to reseed the random → still not deterministic even with a dataset
	try:
		root = os.environ.get(datasetLocationEnvvar, inFolder),
		file = os.environ.get(datasetFilenameEnvvar),
		if file:
			with open('{root}{file}'.format(root=root, file=file), 'r') as file:
				random.seed(file.read(), random.random())
	except FileNotFoundError:
		pass

	# Generate random value and write it to the callback file
	callback = '{:064x}'.format(random.getrandbits(256))
	with open(callbackFilePath, 'w') as callbackFile:
		callbackFile.write('0x{}'.format(callback))

	# Generate the determinism file for verification and write it to the determinism file
	determinism = sha3.keccak_256()
	determinism.update(bytes.fromhex(callback))

	with open(determinismFilePath, 'w') as determinismFile:
		determinismFile.write('0x{}'.format(determinism.hexdigest()))
