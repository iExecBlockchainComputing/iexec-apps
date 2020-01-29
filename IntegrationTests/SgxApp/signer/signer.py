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

def GetPublicKey():
    try:
        key = open('/iexec_out/public.key', 'rb');
        pubKeyObj = RSA.importKey(key.read())
    except:
        if debug:
            print("Public key is not valid, couldn't import it!")
            traceback.print_exc()
        pubKeyObj = None

    key.close()
    return pubKeyObj

def WriteEncryptedKey(symmetricKey, pubKeyObj):
    print("Encrypting symmetric key")
    try:
        encryptor = PKCS1_OAEP.new(pubKeyObj)
        encrypted = encryptor.encrypt(symmetricKey)
        with open('/iexec_out/encrypted_key', 'wb+') as output:
            output.write(encrypted)
        if debug:
            with open('/iexec_out/plaintext_key', 'wb+') as output:
                output.write(symmetricKey)

    except:
        print('Error with opening key!')
        traceback.print_exc()
        key.close()

def WriteInitializationVector(iv):
    print("Writing iv on disk")
    try:
        ivfile = open('/iexec_out/iv', 'wb+')
    except:
        traceback.print_exc()
        print(ex)
    else:
        ivfile.write(iv)
    finally:
        ivfile.close()

def TestReadEncryptedKey():
    try:
        with open('/iexec_out/private.key', 'rb') as input:
            binKey = input.read()
            priKeyObj = RSA.importKey(binKey)
        with open('/iexec_out/encrypted_key', 'rb') as encrypted:
            encrypted_key = encrypted.read()
        with open('/iexec_out/plaintext_key', 'rb') as original:
            original_key = original.read()
    except:
        print('Error reading key')
        traceback.print_exc()
    else:
        decryptor = PKCS1_OAEP.new(priKeyObj)
        key = decryptor.decrypt(encrypted_key)
        assert key == original_key, "Keys don't match"
        return key

def TestEncryptedOutput(symmetricKey):
    try:
        with open('/iexec_out/result.zip.aes', 'rb') as input, open('/iexec_out/iv','rb') as ivfile:
            iv = input.read(16)
            ivfromfile = ivfile.read()
            assert iv == ivfromfile, "Init vector don't match"
            encryptedOutput = input.read()
    except:
        print('Error reading encrypted output')
        traceback.print_exc()
    else:
        decryptedOutput = DecryptOutput(encryptedOutput, symmetricKey, iv)
        padNb = decryptedOutput[-1:]

        #test padding
        assert bytearray(decryptedOutput[-padNb[0]:]) == bytearray(padNb * padNb[0]), "Padding not right!"

		#test decrypted equal to original
        decryptedOutput = decryptedOutput[:len(decryptedOutput) - padNb[0]]
        ZipOutput()
        with open('/iexec_out/' + os.env['taskid'] +'_result.zip', 'rb') as input:
            originalZip = input.read()
            assert(decryptedOutput == originalZip)
        with open('/iexec_out/result.test.zip', 'wb+') as output:
            output.write(decryptedOutput)
        zip_ref = zipfile.ZipFile('iexec_out/result.test.zip', 'r')
        zip_ref.extractall('iexec_out')
        zip_ref.close()

def DecryptOutput(encryptedOutput, key, iv):
    aes = AES.new(key, AES.MODE_CBC, iv)
    return aes.decrypt(encryptedOutput)

def ZipOutput():
    zipf = zipfile.ZipFile(zippedOutputPath, 'a', zipfile.ZIP_DEFLATED)

    os.chdir(zipTargetDirectory)

    for root, dirs, files in os.walk('./'):
        for file in files:
            if file == zipFileName:
                continue
            print("Writing file " + file + " to zip archive.")
            zipf.write(os.path.join(root, file))

    zipf.close()

def PadZippedOutput():
    print("Padding zipped output")
    try:
        input = open(zippedOutputPath, 'ab')
        zipSize = os.path.getsize(zippedOutputPath)
        blockSize = 16
        nb = blockSize - zipSize % blockSize
        input.write(bytearray(bytes([nb]) * nb))

    except Exception as ex:
        traceback.print_exc()
        print(ex)

def EncryptZippedOutput(pubKeyObj):
    try:
        input = open(zippedOutputPath, 'rb')
        output = open('/iexec_out/result.zip.aes', 'wb+')

        #generate initalization vector for AES and prepend it to output
        iv = os.getrandom(16)
        output.write(iv)
        WriteInitializationVector(iv)

        #generate AES key and encrypt it/write it on disk
        key = os.getrandom(32)
        WriteEncryptedKey(key, pubKeyObj)

        aes = AES.new(key, AES.MODE_CBC, iv)
        buffer_size = 8192

        #chunks = iter(lambda: input.read(buffer_size), '')
        result = input.read()
        #for chunk in chunks:
        output.write(aes.encrypt(result))

    except Exception as ex:
        traceback.print_exc()


def WriteEnclaveSign(digestPath):
    import hashlib, os
    SHAhash = hashlib.sha3_256()
    try:
        input = open(digestPath, 'rb')
        while 1:
            # Read file in as little chunks
            buf = input.read(4096)
            if not buf : break
            SHAhash.update(buf)
        input.close()

        digest     = '0x' + SHAhash.hexdigest()
        enclaveKey = os.environ['enclave_key']
        taskid     = os.environ['taskid']
        worker     = os.environ['worker']
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
	zipFileName         = os.environ['taskid'] + '_result.zip'
	zippedOutputPath    = zipTargetDirectory + '/' + zipFileName

	ZipOutput()
	WriteEnclaveSign(zippedOutputPath)

	#try to load the public key, if we can't we don't encrypt the results.
	pubKeyObj = GetPublicKey()
	if pubKeyObj is None:
	    copyfile(zippedOutputPath, '/iexec_out/result.zip')
	    if debug:
		    print("Public key couldn't be loaded, results won't be encrypted")
	    quit()

	PadZippedOutput()
	EncryptZippedOutput(pubKeyObj)

	#WriteEnclaveSign(sconeDir + '/' + determinismFile)
