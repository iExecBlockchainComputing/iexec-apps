pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "iexec-doracle-base/contracts/IexecDoracle.sol";

contract AnemometerOracle is Ownable, IexecDoracle
{
	struct TimedValue
	{
		bytes32 oracleCallID;
		uint256 date;
		string longi;
		string  lati;
		uint256  windSpeed; //correct to 3 decimal places
		string weather;
	}

	mapping(bytes32 => TimedValue) public values;

	event ValueUpdated(
		bytes32 indexed id,
		bytes32 indexed oracleCallID,
		uint256 oldDate,
		uint256 oldWindSpeed,
		string  oldWeather,
		uint256 newDate,
		uint256 newWindSpeed,
		string  newWeather 
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
	public pure returns(uint256, string memory, string memory, uint256 , string memory)
	{ return abi.decode(results, (uint256, string , string , uint256 , string )); }

	function processResult(bytes32 _oracleCallID)
	public
	{
		uint256       date;
		string memory longi;
		string memory lati;
		uint256       windSpeed; //correct to 3 decimal places
		string memory weather;

		// Parse results
		(date,longi, lati, windSpeed, weather) = decodeResults(_iexecDoracleGetVerifiedResult(_oracleCallID));

		// Process results
		bytes32 id = keccak256(abi.encode(longi,lati));
		require(values[id].date < date, "new-value-is-too-old");
		emit ValueUpdated(id, _oracleCallID, values[id].date, values[id].windSpeed,values[id].weather, date, windSpeed, weather);
		values[id].oracleCallID = _oracleCallID;
		values[id].date         = date;
		values[id].longi        = longi;
		values[id].lati      = lati;
		values[id].windSpeed = windSpeed;
		values[id].weather = weather;
	}
}
