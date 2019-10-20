pragma solidity ^0.5.0;

import "./ERC1077.sol";

contract Identity is ERC1077
{
	function() external payable {}

	constructor(bytes32 root)
	public
	{
		_addKey(root, MANAGEMENT_KEY, ECDSA_TYPE);
	}

}
