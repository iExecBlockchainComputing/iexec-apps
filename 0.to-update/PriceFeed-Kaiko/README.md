

## Build app, get MrEnclve, docker push, iexec app deploy, iexec order publish --app

### iExec format (1.1.1 revision)

```docker image build -t iexechub/trusted-kaiko-pricefeed:1.1.1 .```

```
#####################################################
MREnclave: bbd5f48fdbc7f21613bd15bf826e450147798ad474c70facf66091d3a9d73bf2|fd0b78847ed35838bd31a2a7af928468|16e7c11e75448e31c94d023e40ece7429fb17481bc62f521c8f70da9c48110a1
#####################################################
```

### ADO format (1.1.2 revision)

```docker image build -t iexechub/trusted-kaiko-pricefeed:1.1.2 .```

```
#####################################################
MREnclave: 834d5cd8e06892bf63aba3897606fb1b8b8b28d4848e93cbdf168aec2f39c275|a9e35165edb0c37144d383852fa962a3|16e7c11e75448e31c94d023e40ece7429fb17481bc62f521c8f70da9c48110a1
#####################################################
```

### Initialize and deploy app

```
iexec app init --wallet-file xx
# Add app uri & MrEnclave before next step
iexec app deploy --wallet-file xx --chain goerli
```

## Create confidential dataset (key.txt), iexec dataset encrypt, ipfs add encrypted-dataset.zip, iexec dataset push-secret, iexec dataset deploy, iexec order publish --dataset

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

Make ```dataset_key.txt.zip``` publicly available (IPFS, Raw Github)
```https://raw.githubusercontent.com/iExecBlockchainComputing/iexec-apps/master/PriceFeed-Kaiko/datasets/encrypted/dataset_key.txt.zip```

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

* params: ```python3 /app/oracle.py btc usd 9```
* tag: ```0x0000000000000000000000000000000000000000000000000000000000000001```

Goerli run: https://explorer.iex.ec/goerli/task/0xc99c65a885a2671d91d7bb5987ce7ae48f24d518e53819d86f8aa0e8f5d04f93

## Oracle receiver

Goerli:
* receiver address: https://goerli.etherscan.io/address/0x7Ca601977C9075bAe2F173bA248356280008AeaF
* verified code: https://goerli.etherscan.io/address/0x7Ca601977C9075bAe2F173bA248356280008AeaF#code
* owner: `0xA1162f07afC3e45Ae89D2252706eB355F6349641`
