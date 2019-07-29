pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "iexec-doracle-base/contracts/IexecDoracle.sol";

contract PriceOracle is Ownable, IexecDoracle
{
	struct TimedValue
	{
		bytes32 oracleCallID;
		string result;
	}

	mapping(bytes32 => TimedValue) public values;

	event ValueUpdated(
		bytes32 indexed id,
		bytes32 indexed oracleCallID,
		string oldResult,
		string newResult
	);

	// Use _iexecHubAddr to force use of custom iexechub, leave 0x0 for autodetect
	constructor(address _iexecHubAddr)
	public IexecDoracle(_iexecHubAddr)
	{}

	function updateEnv(
	  address _authorizedApp
	, address _authorizedDataset
	, address _authorizedWorkerpool
	, bytes32 _requiredtag
	, uint256 _requiredtrust
	)
	public onlyOwner
	{
		_iexecDoracleUpdateSettings(_authorizedApp, _authorizedDataset, _authorizedWorkerpool, _requiredtag, _requiredtrust);
	}

	function decodeResults(bytes memory results)
	public pure returns(string memory)
	{ return abi.decode(results, (string)); }

	function processResult(bytes32 _oracleCallID)
	public
	{
		string memory result;

		// Parse results
		result = decodeResults(_iexecDoracleGetVerifiedResult(_oracleCallID));

		// Process results
		bytes32 id = keccak256(bytes(result));
		emit ValueUpdated(id, _oracleCallID, values[id].result, result);
		values[id].oracleCallID = _oracleCallID;
		values[id].result = result;
	}
}
