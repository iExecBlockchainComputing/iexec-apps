pragma solidity ^0.5.0;

import "./ERC734KeyGetters.sol";
import "./ERC734KeyManagement.sol";
import "./ERC734Execute.sol";

contract ERC734 is ERC734KeyGetters, ERC734KeyManagement, ERC734Execute
{
	function() external payable {}

	constructor(bytes32 root)
	public
	{
		_addKey(root, MANAGEMENT_KEY, ECDSA_TYPE);
	}
}
