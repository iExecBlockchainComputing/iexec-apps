pragma solidity ^0.5.0;

contract IERC1077
{
	// Events
	event ExecutedSigned(bytes32 indexed messageHash, uint256 indexed nonce, bool indexed success);

	// Functions
	function keyNonce(bytes32 _key) external view returns (uint256);

	function executeSigned(
		address        _to,
		uint256        _value,
		bytes calldata _data,
		uint256        _nonce,
		uint256        _gasLimit,
		uint256        _gasPrice,
		address        _gasToken,
		bytes calldata _signature
	)
	external
	returns (uint256 executionId);

	function approveSigned(
		uint256        _id,
		bool           _approve,
		uint256        _nonce,
		uint256        _gasLimit,
		uint256        _gasPrice,
		address        _gasToken,
		bytes calldata _signature
	)
	external
	returns (bool success);
}
