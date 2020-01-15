

## Build app, get MrEnclve, docker push, iexec app deploy, iexec order publish --app

```docker image build -t iexechub/trusted-kaiko-pricefeed:1.0.0 .```

```
#####################################################
MREnclave: 220abf28a41e5f72fc60574adb6c43785c0ee65496bfcc6f13c16b8715347955|82722198f224f234b6f890e347010983|16e7c11e75448e31c94d023e40ece7429fb17481bc62f521c8f70da9c48110a1
#####################################################
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
```https://raw.githubusercontent.com/iExecBlockchainComputing/iexec-apps/trusted-kaiko-pricefeed/PriceFeed-Kaiko/datasets/encrypted/dataset_key.txt.zip```

```
iexec dataset push-secret 0xdataset --secret-path /home/alice/iexec/.secrets/datasets/dataset.secret --keystoredir=/home/alice/wallets --wallet-file=wallet.json --password=xx --chain kovan
```

## Run

* params: ```python3 /app/oracle.py pricefeed btc usd spot_direct_exchange_rate 1d 9 2020-01-01T12:00:00```
* tag: ```0x0000000000000000000000000000000000000000000000000000000000000001```
