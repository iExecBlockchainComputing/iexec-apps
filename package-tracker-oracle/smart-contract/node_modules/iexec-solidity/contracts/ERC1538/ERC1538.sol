pragma solidity ^0.5.10;

import "./ERC1538Store.sol";

contract ERC1538 is ERC1538Store
{
	bytes4 constant internal FALLBACK = bytes4(keccak256("fallback"));

	event CommitMessage(string message);
	event FunctionUpdate(bytes4 indexed functionId, address indexed oldDelegate, address indexed newDelegate, string functionSignature);

	constructor()
	public
	{
		renounceOwnership();
	}

	function _setFunc(bytes memory funcSignature, address funcDelegate)
	internal
	{
		bytes4  funcId      = bytes4(keccak256(funcSignature));
		address oldDelegate = m_funcDelegates[funcId];

		if (funcId == FALLBACK)
		{
			funcId = bytes4(0);
		}

		if (funcDelegate == address(0))
		{
			uint256 index     = m_funcIndex[funcId] - 1;
			uint256 lastIndex = m_funcSignatures.length - 1;
			if (index != lastIndex)
			{
				m_funcSignatures[index] = m_funcSignatures[lastIndex];
				m_funcIndex[bytes4(keccak256(m_funcSignatures[lastIndex]))] = m_funcIndex[funcId];
			}
			delete m_funcDelegates[funcId];
			delete m_funcIndex[funcId];
			m_funcSignatures.length--;
		}
		else if (oldDelegate == address(0))
		{
			m_funcDelegates[funcId] = funcDelegate;
			m_funcIndex[funcId]     = m_funcSignatures.push(funcSignature);
		}
		else if (oldDelegate != funcDelegate)
		{
			m_funcDelegates[funcId] = funcDelegate;
		}

		emit FunctionUpdate(funcId, oldDelegate, funcDelegate, string(funcSignature));
	}
}
