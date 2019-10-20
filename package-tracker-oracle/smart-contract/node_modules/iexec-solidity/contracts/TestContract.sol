pragma solidity ^0.5.0;

contract TestContract
{
	address public caller;
	bytes   public value;

	function () external payable
	{
		revert("fallback should revert");
	}

	function set(bytes calldata _value) external
	{
		caller = msg.sender;
		value  = _value;
	}

}
