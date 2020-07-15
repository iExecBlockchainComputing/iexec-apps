iExec Dencentralized Oracle System
==================================

About iExec
-----------

Thanks to iExec, it is possible to achieve onchain consensus about the result of an offchain application. Applications are represented by smart contracts and execution results can be made available onchain with all the necessary proof.

Building an oracle application
------------------------------

iExec applications produce different outputs.
* The consensus is achieved based on a deterministic value describing the application output. By default this is the hash of the result archive, but can be overriden by the content of `/iexec_out/determinism.iexec`. Upon successful verification, this is stored onchain in the `task.resultDigest` field.
* The actual result. By default this is the IPFS address of a (potentially encrypted) archive containing the outputs, but can be overridden by the content of `/iexec_out/callback.iexec`. Upon successful verification, this is stored onchain in the `task.results` field.

An iExec oracle application such as the one used in the price-oracle example uses these 2 elements to produce verified results to the blockchain.

Given a set of parameters, the application produces a self-describing result, encodes it in a way that can be interpreted onchain, stores it in `/iexec_out/callback.iexec` so that is can be accessed onchain, and stores the hash of this encoded value to perform the consensus.

For example, given the parameters "BTC USD 9 2019-04-11T13:08:32.605Z" the price-oracle application will:

1. Retreive the price of BTC in USD at 2019-04-11T13:08:32.605Z
2. Multiply this value by 10e9 (to capture price value more accurately as it will be represented by an integer onchain)
3. encode the date, the description ("btc-usd-9") and the value using `abi.encode`
4. Store this result in `/iexec_out/callback.iexec`
5. hash the result and store it in `/iexec_out/determinism.iexec`

iExec will then achieve PoCo consensus on the `/iexec_out/determinism.iexec` value, and will store both the `/iexec_out/determinism.iexec` and the `/iexec_out/callback.iexec` onchain.

Given a taskID, it is possible to retrieve all the details of the computation as described above. The oracle smart contract just needs to retrieve the information, verify the validity of the execution and process the encoded result. Thanks to the PoCo consensus, anyone can require a computation and ask the oracle to update itself in a trustless manner.

How to setup an oracle contract
-------------------------------

1. Record the address of the iExec Hub and Clerk contracts

2. Register the requirements needed for a result to be processed
	* Which application (single, any, whitelist?)
	* Which dataset (single, any, whitelist?)
	* Which workerpool (single, any, whitelist?)
	* Minimum level of trust
	* Mandatory tag

How to update an oracle contract
--------------------------------

1. Send the taskID of a valid execution to the oracle smart contract.
2. The oracle smart contract retrieves details about this task from the iexec's smart contracts.
3. The oracle smart contract verifies the execution is valid (authorized app, dataset, workerpool, trust level and tags).
4. The oracle smart contract verifies the hash of the results correspond to the resultDigest that achieved consensus, thus verifying the validity of the result field.
5. The oracle smart contract decodes the results using `abi.decode`.
6. The oracle smart contract processes the results. In the case of the price oracle, this means storing the value if it is more recent than the one currently recorded.

How to read price from the iExec price oracle
---------------------------------------------

Just query the oracle `values` field with the id of the requested field. For example, to get the most recent price of BTC in USD with 9 place precision (as described above), query `values(keccak256(bytes("BTC-USD-9")))` and this will return a structure containing the value, the associate date, and the details of the request.

Deployed addresses
------------------

1. **Kovan:**

	price oracle: `https://kovan.etherscan.io/address/0x3b9f1a9aecb1991f3818f45bd4cc735f4bee93ac`

	app whitelist: `https://kovan.etherscan.io/address/0x651a09cdff5a6669ea8bf05be11eff4aa9cbfdaf`

	whitelist contains:

	* `0xf92f39545340ce2fd6f4248a689fca4f660ae42f`
	* `0xe01bccbcab54c42f999b6ce88d63d3a5e96cfdb7`

	Whitelist is administered by:

	* `0x7bd4783FDCAD405A28052a0d1f11236A741da593`
