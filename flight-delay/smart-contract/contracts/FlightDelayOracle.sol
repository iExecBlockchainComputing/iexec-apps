pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "iexec-doracle-base/contracts/IexecDoracle.sol";

contract FlightDelayOracle is Ownable, IexecDoracle
{
	struct TimedValue
	{
		bytes32 oracleCallID;
		uint256 date;
		uint256 flightId;
		uint256 delay; 		//delay in minutes
	}

	mapping(bytes32 => TimedValue) public values;

	event ValueUpdated(
		bytes32 indexed id,
		bytes32 indexed oracleCallID,
		uint256 oldDate,
		uint256 oldDelay,
		uint256 newDate,
		uint256 newDelay 
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
	public pure returns(uint256,  uint256 , uint256)
	{ return abi.decode(results, (uint256,  uint256 , uint256 )); }

	function processResult(bytes32 _oracleCallID)
	public
	{
		uint256       date;
		uint256 flightId;
		uint256       delay; //correct to 3 decimal places

		// Parse results
		(date, flightId, delay) = decodeResults(_iexecDoracleGetVerifiedResult(_oracleCallID));

		// Process results
		bytes32 id = keccak256(abi.encode(flightId));
		require(values[id].date < date, "new-value-is-too-old");
		emit ValueUpdated(id, _oracleCallID, values[id].date, values[id].delay, date, delay);
		values[id].oracleCallID = _oracleCallID;
		values[id].date         = date;
		values[id].flightId     = flightId;
		values[id].delay = delay;
	}
}
