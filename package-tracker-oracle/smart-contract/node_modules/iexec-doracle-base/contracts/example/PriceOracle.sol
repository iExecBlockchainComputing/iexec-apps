pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../IexecDoracle.sol";

contract PriceOracle is Ownable, IexecDoracle
{
	struct TimedValue
	{
		bytes32 oracleCallID;
		uint256 date;
		uint256 value;
		string  details;
	}

	mapping(bytes32 => TimedValue) public values;

	event ValueUpdated(
		bytes32 indexed id,
		bytes32 indexed oracleCallID,
		uint256 oldDate,
		uint256 oldValue,
		uint256 newDate,
		uint256 newValue
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
	public pure returns(uint256, string memory, uint256)
	{ return abi.decode(results, (uint256, string, uint256)); }

	function processResult(bytes32 _oracleCallID)
	public
	{
		uint256       date;
		string memory details;
		uint256       value;

		// Parse results
		(date, details, value) = decodeResults(_iexecDoracleGetVerifiedResult(_oracleCallID));

		// Process results
		bytes32 id = keccak256(bytes(details));
		require(values[id].date < date, "new-value-is-too-old");
		emit ValueUpdated(id, _oracleCallID, values[id].date, values[id].value, date, value);
		values[id].oracleCallID = _oracleCallID;
		values[id].date         = date;
		values[id].value        = value;
		values[id].details      = details;
	}
}
