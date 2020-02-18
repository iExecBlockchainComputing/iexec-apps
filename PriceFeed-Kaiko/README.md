

## Build app, get MrEnclve, docker push, iexec app deploy, iexec order publish --app

```docker image build -t iexechub/trusted-kaiko-pricefeed:1.1.0 .```

```
#####################################################
MREnclave: e0dd3af87cc7588b10f13dd3973bcc976d604eb3875714a38078e4728988552a|a5f6a9414186dbc8980dda7dffccee18|16e7c11e75448e31c94d023e40ece7429fb17481bc62f521c8f70da9c48110a1
#####################################################
```
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

* params: ```python3 /app/oracle.py pricefeed btc usd 9```
* tag: ```0x0000000000000000000000000000000000000000000000000000000000000001```

Goerli run: https://explorer.iex.ec/goerli/task/0x58125c350edd1ee275826ff32e74e5946af4dd7d73c955e8d4220f03808c81d7

## Oracle receiver

Goerli:
* receiver address: https://goerli.etherscan.io/address/0x7Ca601977C9075bAe2F173bA248356280008AeaF
* verified code: https://goerli.etherscan.io/address/0x7Ca601977C9075bAe2F173bA248356280008AeaF#code
* owner: `0xA1162f07afC3e45Ae89D2252706eB355F6349641`
