pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "iexec-doracle-base/contracts/IexecDoracle.sol";

contract LiveScoreOracle is Ownable, IexecDoracle
{
	struct FixtureValue
	{
		bytes32 oracleCallID;
		string status;	
		string location;
		string added;	
        string home_name;
        uint256 score_home;
		string away_name;
		uint256 score_away;
                

	}

	mapping(bytes32 => FixtureValue) public values;

/*
	event ValueUpdated(
		bytes32 indexed id,
		bytes32 indexed oracleCallID,
		string oldStatus,
		string newStatus,
        uint256 oldScore_home,
        uint256 newScore_home,
		uint256 oldScore_away,
		uint256 newScore_away
	);
*/


	event ValueUpdated(
		bytes32 indexed id,
		bytes32 indexed oracleCallID,
		string  status,
        uint256 score_home,
		uint256 score_away

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


	function decodeResults(bytes memory data)
	public pure returns(string memory a, string memory b, string memory c, string memory d, uint256 e, string memory f, uint256 g)
	{ 
		string memory status;	
		string memory location;
		string memory added;	
        string memory home_name;
        uint256 score_home;
		string memory away_name;
		uint256 score_away;

	(status, location, added, home_name, score_home, away_name, score_away)= abi.decode(data, (string, string, string, string, uint256, string, uint256)); 
	
	return (status, location, added, home_name, score_home, away_name, score_away);

	}
/*
 function strConcat(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e) internal pure returns (string memory _concatenatedString) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        uint i = 0;
        for (i = 0; i < _ba.length; i++) {
            babcde[k++] = _ba[i];
        }
        for (i = 0; i < _bb.length; i++) {
            babcde[k++] = _bb[i];
        }
        for (i = 0; i < _bc.length; i++) {
            babcde[k++] = _bc[i];
        }
        for (i = 0; i < _bd.length; i++) {
            babcde[k++] = _bd[i];
        }
        for (i = 0; i < _be.length; i++) {
            babcde[k++] = _be[i];
        }
        return string(babcde);
    }
*/

     function strConcat(string memory _a, string memory _b, string memory _c) internal pure returns (string memory _concatenatedString) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
   
        string memory abcde = new string(_ba.length + _bb.length + _bc.length );
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        uint i = 0;
        for (i = 0; i < _ba.length; i++) {
            babcde[k++] = _ba[i];
        }
        for (i = 0; i < _bb.length; i++) {
            babcde[k++] = _bb[i];
        }
        for (i = 0; i < _bc.length; i++) {
            babcde[k++] = _bc[i];
        }
   
        return string(babcde);
    }

	function processResult(bytes32 _oracleCallID)
	public
	{
		string memory status;	
		string memory location;
		string memory added;	
        string memory home_name;
        uint256 score_home;
		string memory away_name;
		uint256 score_away;

		// Parse results
		(status, location, added, home_name, score_home, away_name, score_away) = decodeResults(_iexecDoracleGetVerifiedResult(_oracleCallID));

      //  string memory te= strConcat(home_name,away_name,added);
		// Process results
		//uint256 id =  uint256(keccak256(te));
		bytes32 id = sha256(bytes (strConcat(home_name,away_name,added)));

		emit ValueUpdated(id, _oracleCallID, status, score_home, score_away);


		values[id].oracleCallID = _oracleCallID;
		values[id].status;	
		values[id].location;
		values[id].added;	
        values[id].home_name;
        values[id].score_home;
		values[id].away_name;
		values[id].score_away;
	}
}
