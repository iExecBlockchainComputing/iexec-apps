

## Build app, get MrEnclve, docker tag & push, iexec app deploy, iexec order publish --app

### Docker Build & Push

`./tee/build`

### Deploy app

```
"app": {
    "owner": "0x15Bd06807eF0F2284a9C5baeAA2EF4d5a88eB72A",
    "name": "offchain-tee-kaiko-pricefeed",
    "type": "DOCKER",
    "multiaddr": "docker.io/iexechub/offchain-tee-kaiko-pricefeed:5.0.0",
    "checksum": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "mrenclave": "02371762e6daedd94bddc8d378e465a56178d2db086befb32cc30a503b92405c|593aa8de86756c99b599117dd3e79ac7|2a421b3b7a6f771c3a602f49ce05b6a75793312b8e2c61c673fe7085a16cf138|python /app/app.py"
}
ℹ Using chain [goerli]
✔ Deployed new app at address 0xbfE5C1eacD47ba0C9876cc541a3dF8D70d221D4f

iexec app init --wallet-file xx
# Add app uri & MrEnclave before next step
iexec app deploy --wallet-file xx --chain goerli
```

## Create confidential asset (key.txt), iexec dataset encrypt, ipfs add encrypted-dataset.zip, iexec dataset push-secret, iexec dataset deploy, iexec order publish --dataset

```
ls /home/alice/iexec
├── iexec.json
├── chain.json
```

Secret: ```/home/alice/iexec/dataset/original/key.txt```

```iexec dataset encrypt --algorithm scone```
```
├── iexec.json
├── chain.json
├── datasets
│   ├── encrypted
│   │   └── dataset_key.txt.zip
│   └── original
│       └── key.txt
```

### Deploy Dataset

Make ```dataset_key.txt.zip``` publicly available (IPFS, Raw Github)

```
//v5 branch
"dataset": {
    "owner": "0x15Bd06807eF0F2284a9C5baeAA2EF4d5a88eB72A",
    "name": "encrypted-kaiko-pricefeed-api-key",
    "multiaddr": "https://raw.githubusercontent.com/iExecBlockchainComputing/iexec-apps/v5/offchain-computing/offchain-tee-kaiko-pricefeed/tee/datasets/encrypted/dataset_key.txt.zip",
    "checksum": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
ℹ Using chain [goerli]
✔ Deployed new dataset at address 0x792D22e259D78D7939daa4De4Da99C3fd2C80074

//master branch
"dataset": {
    "owner": "0x15Bd06807eF0F2284a9C5baeAA2EF4d5a88eB72A",
    "name": "encrypted-kaiko-pricefeed-api-key",
    "multiaddr": "https://raw.githubusercontent.com/iExecBlockchainComputing/iexec-apps/master/offchain-computing/offchain-tee-kaiko-pricefeed/tee/datasets/encrypted/dataset_key.txt.zip",
    "checksum": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
ℹ Using chain [goerli]
✔ Deployed new dataset at address 0xc544573dEf12c71F0bA8bCF992d3Ed9590586452
```


```
iexec dataset init --wallet-file xx
# Add dataset uri before next step
iexec dataset deploy --wallet-file xx --chain goerli

iexec dataset push-secret 0xdataset --secret-path /home/alice/iexec/.secrets/datasets/dataset.secret --keystoredir=/home/alice/wallets --wallet-file=wallet.json --password=xx --chain kovan
```

```
## Orders

iexec order init --app --wallet-file xx --chain goerli
iexec order sign --app --wallet-file xx --chain goerli
iexec order publish --app --wallet-file xx --chain goerli

iexec order init --dataset --wallet-file xx --chain goerli
# Add app restriction before next step
iexec order sign --dataset --wallet-file xx --chain goerli
iexec order publish --dataset --wallet-file xx --chain goerli
```

## Run

```
iexec app run 0xbfE5C1eacD47ba0C9876cc541a3dF8D70d221D4f --dataset 0x792D22e259D78D7939daa4De4Da99C3fd2C80074 --workerpool 0xEb6c3FA8522f2C342E94941C21d3947c099e6Da0 --params '{"iexec_args": "btc usd 9","iexec_tee_post_compute_image":"iexechub/tee-worker-post-compute:1.0.0","iexec_tee_post_compute_fingerprint":"7f9f64e152f30d3f6e450d18fd64d6cd5d323d2af3fd153a3697a155a0d8f113|aa413ae09b0483bf8bbaf83cf4cc6957|13076027fc67accba753a3ed2edf03227dfd013b450d68833a5589ec44132100"}' --tag 0x0000000000000000000000000000000000000000000000000000000000000001 --callback 0x0000000000000000000000000000000000000001
```


* params: ```btc usd 9```
* tag: ```0x0000000000000000000000000000000000000000000000000000000000000001```

Goerli run: https://v5.explorer.iex.ec/goerli/task/0xe9be15e98933a2809a07fa64a7cd7ecbd22bf9cc2bb038fffebc006f6e3bca48

## Oracle receiver

//TODO UPDATE
Goerli:
* receiver address: https://goerli.etherscan.io/address/0x7Ca601977C9075bAe2F173bA248356280008AeaF
* verified code: https://goerli.etherscan.io/address/0x7Ca601977C9075bAe2F173bA248356280008AeaF#code
* owner: `0xA1162f07afC3e45Ae89D2252706eB355F6349641`
