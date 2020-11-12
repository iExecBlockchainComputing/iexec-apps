pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "iexec-doracle-base/contracts/IexecDoracle.sol";

contract WeatherStationOracle is Ownable, IexecDoracle
{
	struct WeatherReport
	{
		bytes32 oracleCallID;
		string 	description;
		bool	historicalData;
	}

	struct Location
	{
		string  location;
		mapping(uint256 => WeatherReport) reports;
	}

	mapping (bytes32 => Location) public locations;
	

	event NewWeatherReport(
		bytes32 indexed id,
		bytes32 indexed oracleCallID,
		string 	location,
		uint256 date,
		string 	description
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
	public pure returns(uint256, string memory, string memory)
	{ return abi.decode(results, (uint256, string, string)); }

	function processResult(bytes32 _oracleCallID)
	public
	{
		uint256       date;
		string memory location;
		string memory description;

		// Parse results
		(date, location, description) = decodeResults(_iexecDoracleGetVerifiedResult(_oracleCallID));

		// Process results
		bytes32 id = keccak256(bytes(location));
		require (!locations[id].reports[date].historicalData, "report is already fetched for given location and time");
		emit NewWeatherReport(id, _oracleCallID, location, date, description);
		locations[id].reports[date].oracleCallID 	= _oracleCallID;
		locations[id].reports[date].description     = description;
		locations[id].reports[date].historicalData 	= now > date ? true : false;
		locations[id].location     					= location;
	}

	function getWeatherReport(bytes32 id, uint256 date) public view returns(WeatherReport memory) {
		return locations[id].reports[date];
	}
}