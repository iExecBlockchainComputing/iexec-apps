pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "iexec-poco/contracts/libs/IexecODBLibCore.sol";


contract IexecHubInterface
{
	uint256 public constant CONTRIBUTION_DEADLINE_RATIO = 7;
	uint256 public constant       REVEAL_DEADLINE_RATIO = 2;
	uint256 public constant        FINAL_DEADLINE_RATIO = 10;

	address public iexecclerk;
	address public appregistry;
	address public datasetregistry;
	address public workerpoolregistry;

	event TaskInitialize(bytes32 indexed taskid, address indexed workerpool               );
	event TaskContribute(bytes32 indexed taskid, address indexed worker, bytes32 hash     );
	event TaskConsensus (bytes32 indexed taskid,                         bytes32 consensus);
	event TaskReveal    (bytes32 indexed taskid, address indexed worker, bytes32 digest   );
	event TaskReopen    (bytes32 indexed taskid                                           );
	event TaskFinalize  (bytes32 indexed taskid,                         bytes   results  );
	event TaskClaimed   (bytes32 indexed taskid                                           );

	event AccurateContribution(address indexed worker, bytes32 indexed taskid);
	event FaultyContribution  (address indexed worker, bytes32 indexed taskid);

	function attachContracts(
		address _iexecclerkAddress,
		address _appregistryAddress,
		address _datasetregistryAddress,
		address _workerpoolregistryAddress)
	external;

	function viewTask(bytes32 _taskid)
	external view returns (IexecODBLibCore.Task memory);

	function viewContribution(bytes32 _taskid, address _worker)
	external view returns (IexecODBLibCore.Contribution memory);

	function viewScore(address _worker)
	external view returns (uint256);

	function checkResources(address aap, address dataset, address workerpool)
	external view returns (bool);

	function resultFor(bytes32 id)
	external view returns (bytes memory);

	function initialize(
		bytes32 _dealid,
		uint256 idx)
	public returns (bytes32);

	function contribute(
		bytes32      _taskid,
		bytes32      _resultHash,
		bytes32      _resultSeal,
		address      _enclaveChallenge,
		bytes memory _enclaveSign,
		bytes memory _workerpoolSign)
	public;

	function reveal(
		bytes32 _taskid,
		bytes32 _resultDigest)
	external;

	function reopen(
		bytes32 _taskid)
	external;

	function finalize(
		bytes32 _taskid,
		bytes calldata  _results)
	external;

	function claim(
		bytes32 _taskid)
	public;

	function initializeArray(
		bytes32[] calldata _dealid,
		uint256[] calldata _idx)
	external returns (bool);

	function claimArray(
		bytes32[] calldata _taskid)
	external returns (bool);

	function initializeAndClaimArray(
		bytes32[] calldata _dealid,
		uint256[] calldata _idx)
	external returns (bool);

	function viewCategory(uint256 _catid)
	external view returns (IexecODBLibCore.Category memory category);

	function countCategory()
	external view returns (uint256);

	function createCategory(
		string  calldata name,
		string  calldata description,
		uint256          workClockTimeRef)
	external returns (uint256);
}
