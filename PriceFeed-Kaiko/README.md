

## Build app, get MrEnclve, docker push, iexec app deploy, iexec order publish --app

```docker image build -t iexechub/trusted-kaiko-pricefeed:1.0.3 .```

```
#####################################################
MREnclave: bf10ad6cb4cdf68751da7e527775bad5b552e63c061a1cea6ac94d5842aa5f00|9dfcb39440e9159712ab0ecaa6cc9fc3|16e7c11e75448e31c94d023e40ece7429fb17481bc62f521c8f70da9c48110a1
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

* params: ```python3 /app/oracle.py pricefeed btc usd spot_direct_exchange_rate 1d 9 2020-01-01T12:00:00```
* tag: ```0x0000000000000000000000000000000000000000000000000000000000000001```

Goerli run: https://explorer.iex.ec/goerli/task/0x171d4a18b30912aaef6c0baa08027607b9359fe1afbe4b4b158e829acd29aa12
(Kovan run: https://explorer.iex.ec/kovan/deal/0xcaa54a7f513dbb2fef987a4919a9741b8538d0c13813508be3b36dd5d08befdf)
