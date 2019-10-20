pragma solidity ^0.5.10;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract ERC1538Store is Ownable
{
	mapping(bytes4 => address) internal m_funcDelegates;
	mapping(bytes4 => uint256) internal m_funcIndex;
	bytes[]                    internal m_funcSignatures;
}
