Bitcoin Transfer Verifier DOracle using blockchain.info API
-----

App
-----
given a valid bitcoin transaction hash as input 'b6f6991d03df0e2e04dafffcd6bc418aac66049e2cd74b80f14ac86db1e3f0da'

returns bitcoin transaction hash as ID (bytes32) along with transfer amount in sats and transaction timestamp (packed uint256)
`0xb6f6991d03df0e2e04dafffcd6bc418aac66049e2cd74b80f14ac86db1e3f0da000000000000000000000000000000000000000000000001f2ed64005d3b7183`

Usage
-----
`docker run -v /tmp/iexec_out:/iexec_out j048/app-bitcoin-tx-doracle:latest b6f6991d03df0e2e04dafffcd6bc418aac66049e2cd74b80f14ac86db1e3f0da`

Smart Contract
-----
stores Bitcoin transaction hash as ID(bytes32) along with iExec oracle call ID(bytes32), transfer amount(uint256) in sats, and transaction timestamp(uint256) in unix time

creates transaction Receipt Event Log of TxUpdated with values txHash, oracleCallID, amount, timestamp

to access stored values for transaction use mapping function txAmount(bytes32 Bitcoin transaction hash)

`txAmount(0xb6f6991d03df0e2e04dafffcd6bc418aac66049e2cd74b80f14ac86db1e3f0da)`

to verify:
https://www.blockchain.com/btc/tx/b6f6991d03df0e2e04dafffcd6bc418aac66049e2cd74b80f14ac86db1e3f0da
