pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "iexec-poco/contracts/libs/IexecODBLibCore.sol";
import "iexec-poco/contracts/libs/IexecODBLibOrders.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";


contract IexecClerkInterface
{
	uint256 public constant WORKERPOOL_STAKE_RATIO = 30;
	uint256 public constant KITTY_RATIO            = 10;
	uint256 public constant KITTY_MIN              = 1000000000;
	uint256 public constant GROUPMEMBER_PURPOSE    = 4;

	bytes32 public /* immutable */ EIP712DOMAIN_SEPARATOR;

	IERC20 public token;

	event OrdersMatched        (bytes32 dealid, bytes32 appHash, bytes32 datasetHash, bytes32 workerpoolHash, bytes32 requestHash, uint256 volume);
	event ClosedAppOrder       (bytes32 appHash);
	event ClosedDatasetOrder   (bytes32 datasetHash);
	event ClosedWorkerpoolOrder(bytes32 workerpoolHash);
	event ClosedRequestOrder   (bytes32 requestHash);
	event SchedulerNotice      (address indexed workerpool, bytes32 dealid);

	event Deposit   (address owner, uint256 amount);
	event DepositFor(address owner, uint256 amount, address target);
	event Withdraw  (address owner, uint256 amount);
	event Reward    (address user,  uint256 amount, bytes32 ref);
	event Seize     (address user,  uint256 amount, bytes32 ref);
	event Lock      (address user,  uint256 amount);
	event Unlock    (address user,  uint256 amount);

	event BroadcastAppOrder       (IexecODBLibOrders.AppOrder        apporder       );
	event BroadcastDatasetOrder   (IexecODBLibOrders.DatasetOrder    datasetorder   );
	event BroadcastWorkerpoolOrder(IexecODBLibOrders.WorkerpoolOrder workerpoolorder);
	event BroadcastRequestOrder   (IexecODBLibOrders.RequestOrder    requestorder   );

	function viewRequestDeals(bytes32 _id)
	external view returns (bytes32[] memory);

	function viewDeal(bytes32 _id)
	external view returns (IexecODBLibCore.Deal memory);

	function viewConsumed(bytes32 _id)
	external view returns (uint256);

	function viewPresigned(bytes32 _id)
	external view returns (bool presigned);

	function signAppOrder(IexecODBLibOrders.AppOrder memory _apporder)
	public returns (bool);

	function signDatasetOrder(IexecODBLibOrders.DatasetOrder memory _datasetorder)
	public returns (bool);

	function signWorkerpoolOrder(IexecODBLibOrders.WorkerpoolOrder memory _workerpoolorder)
	public returns (bool);

	function signRequestOrder(IexecODBLibOrders.RequestOrder memory _requestorder)
	public returns (bool);

	function matchOrders(
		IexecODBLibOrders.AppOrder        memory _apporder,
		IexecODBLibOrders.DatasetOrder    memory _datasetorder,
		IexecODBLibOrders.WorkerpoolOrder memory _workerpoolorder,
		IexecODBLibOrders.RequestOrder    memory _requestorder)
	public returns (bytes32);

	function cancelAppOrder(IexecODBLibOrders.AppOrder memory _apporder)
	public returns (bool);

	function cancelDatasetOrder(IexecODBLibOrders.DatasetOrder memory _datasetorder)
	public returns (bool);

	function cancelWorkerpoolOrder(IexecODBLibOrders.WorkerpoolOrder memory _workerpoolorder)
	public returns (bool);

	function cancelRequestOrder(IexecODBLibOrders.RequestOrder memory _requestorder)
	public returns (bool);

	function viewAccount(address _user)
	external view returns (IexecODBLibCore.Account memory);

	function deposit(uint256 _amount)
	external returns (bool);

	function depositFor(uint256 _amount, address _target)
	public returns (bool);

	function depositForArray(uint256[] calldata _amounts, address[] calldata _targets)
	external returns (bool);

	function withdraw(uint256 _amount)
	external returns (bool);

	function broadcastAppOrder(IexecODBLibOrders.AppOrder memory _apporder)
	public;

	function broadcastDatasetOrder(IexecODBLibOrders.DatasetOrder memory _datasetorder)
	public;

	function broadcastWorkerpoolOrder(IexecODBLibOrders.WorkerpoolOrder memory _workerpoolorder)
	public;

	function broadcastRequestOrder(IexecODBLibOrders.RequestOrder memory _requestorder)
	public;
}
