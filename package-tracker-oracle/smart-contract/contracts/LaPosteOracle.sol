pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "iexec-doracle-base/contracts/IexecDoracle.sol";

contract LaPosteOracle is Ownable, IexecDoracle
{

	enum Status {
		PRIS_EN_CHARGE,
		EN_LIVRAISON,
		EXPEDIE,
		A_RETIRER,
		TRI_EFFECTUE,
		DISTRIBUE,
		LIVRE,
		DESTINATAIRE_INFORME,
		RETOUR_DESTINATAIRE,
		ERREUR,
		INCONNU
	}
	
	struct TrackingReport
	{
		bytes32 oracleCallID;
		string 	trackingNumber;
		Status  trackingStatus;
		uint256	lastUpdated;
	}

	mapping (bytes32 => TrackingReport) public trackings;

	event NewTrackingReport(
		bytes32 indexed id,
		bytes32 indexed oracleCallID,
		string 	trackingNumber,
		uint256 status,
		uint256 lastUpdated
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
	public pure returns(string memory, uint256, uint256)
	{ return abi.decode(results, (string, uint256, uint256)); }

	function processResult(bytes32 _oracleCallID)
	public
	{
		string memory trackingNumber;
		uint256       status;
		uint256		  date;

		// Parse results
		(trackingNumber, status, date) = decodeResults(_iexecDoracleGetVerifiedResult(_oracleCallID));

		// Process results
		bytes32 id = keccak256(bytes(trackingNumber));
		require (date > trackings[id].lastUpdated, "tracking report is too old");
		emit NewTrackingReport(id, _oracleCallID, trackingNumber, status, date);
		trackings[id].oracleCallID 		= _oracleCallID;
		trackings[id].trackingNumber    = trackingNumber;
		trackings[id].trackingStatus 	= Status(status);
		trackings[id].lastUpdated     	= date;
	}
}