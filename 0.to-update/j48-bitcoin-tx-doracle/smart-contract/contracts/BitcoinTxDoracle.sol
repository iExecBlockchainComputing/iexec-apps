pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "iexec-doracle-base/contracts/IexecDoracle.sol";

contract BitcoinTxDoracle is Ownable, IexecDoracle{

	struct Tx
	{
		bytes32 oracleCallID;
		uint256 amount;
		uint256 timestamp;
	}

	mapping(bytes32 => Tx) public txAmount;
	
	event TxUpdated(
		bytes32 indexed txHash,
		bytes32 indexed oracleCallID,
		uint256 amount,
		uint256 timestamp);

	// Use _iexecHubAddr to force use of custom iexechub, leave 0x0 for autodetect
	constructor(address _iexecHubAddr)
	public IexecDoracle(_iexecHubAddr)
	{}

	function updateEnv(address _authorizedApp, address _authorizedDataset, address _authorizedWorkerpool, bytes32 _requiredtag, uint256 _requiredtrust)
	public onlyOwner
	{
		_iexecDoracleUpdateSettings(_authorizedApp, _authorizedDataset, _authorizedWorkerpool, _requiredtag, _requiredtrust);
	}

	function decodeResults(bytes memory results)
	public pure returns(bytes32, bytes32)
	{ return abi.decode(results, (bytes32, bytes32)); }

	function processResult(bytes32 _oracleCallID)
	public
	{
		bytes32       hash;
		bytes32       packedData;

		// Parse results
		(hash, packedData) = decodeResults(_iexecDoracleGetVerifiedResult(_oracleCallID));

		// Process results
		// unpack require data
		uint256   timestamp = uint256(uint40(uint256(packedData>>0)));
		
		require(txAmount[hash].timestamp < timestamp, "tx-exists");
		// there should only ever be 1 entry per tx
		
		emit TxUpdated(hash, _oracleCallID, amount, timestamp);
		
		txAmount[hash].oracleCallID = _oracleCallID;
		txAmount[hash].amount       = uint256(uint216(uint256(packedData>>40)));
		txAmount[hash].timestamp    = timestamp;
	}

	}
