#!/usr/bin/python3

import os
import random
import sha3

root                = '';
inFolder            = '{}iexec_in/'.format(root);
outFolder           = '{}iexec_out/'.format(root);
callbackFilePath    = '{}callback.iexec'.format(outFolder);
determinismFilePath = '{}determinism.iexec'.format(outFolder);

datasetEnvVar       = 'IEXEC_DATASET_FILENAME';

if __name__ == '__main__':

	# OPTIONAL: use dataset to reseed the random → still not deterministic even with a seed
	if datasetEnvVar in os.environ:
		try:
			with open('{}{}'.format(inFolder, os.environ[datasetEnvVar]), 'r') as seedFile:
				random.seed(seedFile.read(), random.random());
		except:
			# TODO ERROR
			pass

	# Generate random value and write it to the callback file
	callback = "{:x}".format(random.getrandbits(256))

	with open(callbackFilePath, 'w') as callbackFile:
		callbackFile.write('0x{}'.format(callback))

	# Generate the determinism file for verification and write it to the determinism file
	determinism = sha3.keccak_256()
	determinism.update(bytes.fromhex(callback))

	with open(determinismFilePath, 'w') as determinismFile:
		determinismFile.write('0x{}'.format(determinism.hexdigest()))
