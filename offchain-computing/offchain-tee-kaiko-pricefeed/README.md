

## Build app, get MrEnclve, docker tag & push, iexec app deploy, iexec order publish --app

### Docker Build & Push

`./tee/build`

### Deploy app

```
"app": {
    "owner": "0x15Bd06807eF0F2284a9C5baeAA2EF4d5a88eB72A",
    "name": "offchain-tee-kaiko-pricefeed",
    "type": "DOCKER",
    "multiaddr": "docker.io/iexechub/offchain-tee-kaiko-pricefeed:5.0.1",
    "checksum": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "mrenclave": "4a39755a6a07cf885d7d3c7358bef277c7233746d283f4a48491b87d772b4199|958742b031be41d52d4f11ab2afc063a|2a421b3b7a6f771c3a602f49ce05b6a75793312b8e2c61c673fe7085a16cf138|python /app/app.py"
}
ℹ Using chain [goerli]
✔ Deployed new app at address 0xa78bf0FF3661b96A97bDd7a1382360fce5F1eFdD

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
iexec app run 0xa78bf0FF3661b96A97bDd7a1382360fce5F1eFdD --dataset 0xc544573dEf12c71F0bA8bCF992d3Ed9590586452 --workerpool 0xEb6c3FA8522f2C342E94941C21d3947c099e6Da0 --params '{"iexec_args": "eth usd 9"}' --tag 0x0000000000000000000000000000000000000000000000000000000000000001 --callback 0xB2bb24cEa9aA32c0555F934C57145414286b70f0 --password whatever --force
```


* params: ```btc usd 9```
* tag: ```0x0000000000000000000000000000000000000000000000000000000000000001```

Goerli run: https://v5.explorer.iex.ec/goerli/deal/0xa78e36abe5f106b4bc9ce95cb9d77a3a99fb336ca891c6926f05b0143aed42b3

## Oracle receiver

Goerli:
```
# Unsafe callback - 0x2760E0CE853b3FfE8d55A6642e597D466A00C8f0
# Safe callback -   0xB2bb24cEa9aA32c0555F934C57145414286b70f0
```
