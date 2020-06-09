import os
import sys
import attrdict
import ssl
import json
import zipfile
import random
import traceback
import gnupg
import base64

from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
from web3.auto import w3
from eth_account.messages import defunct_hash_message
from shutil import copyfile

keccak256 = w3.soliditySha3
debug = True

class DigestSigner:
    def __init__(self, enclaveKey, worker, taskid, digest):
        self.result     = digest;
        self.resultHash = keccak256([ "bytes32", "bytes32" ], [ taskid, digest ])
        self.resultSalt = keccak256([ "address", "bytes32", "bytes32" ], [ worker, taskid, digest ])
        hash = defunct_hash_message(keccak256([ "bytes32", "bytes32" ], [ self.resultHash, self.resultSalt ]))
        self.signature = w3.eth.account.signHash(hash, private_key=enclaveKey).signature

    def jsonify(self):
        return json.dumps({
            'result':     self.result,
            'resultHash': self.resultHash.hex(),
            'resultSalt': self.resultSalt.hex(),
            'signature':  self.signature.hex(),
        })


def WriteEnclaveSign():
    import hashlib, os
    SHAhash = hashlib.sha3_256()
    try:
        input = open(zippedOutputPath, 'rb')
        while 1:
            # Read file in as little chunks
            buf = input.read(4096)
            if not buf : break
            SHAhash.update(buf)
        input.close()

        digest     = '0x' + SHAhash.hexdigest()
        enclaveKey = os.environ['TEE_CHALLENGE_PRIVATE_KEY']
        taskid     = os.environ['TASK_ID']
        worker     = os.environ['WORKER_ADDRESS']
        result     = DigestSigner(
            enclaveKey = enclaveKey,
            worker     = worker,
            taskid     = taskid,
            digest     = digest,
        ).jsonify()

        with open('/iexec_out/enclaveSig.iexec', 'w+') as outfile:
            outfile.write(result)

    except Exception as ex:
        traceback.print_exc()
        print(ex)

if __name__ == '__main__':
    zipTargetDirectory  = '/scone'
    zipFileName         = os.environ['TASK_ID'] + '_result.zip'
    zippedOutputPath    = zipTargetDirectory + '/' + zipFileName

    WriteEnclaveSign()
