pragma solidity ^0.5.0;

import "./ERC1538.sol";


interface ERC1538Query
{
	function totalFunctions            (                           ) external view returns(uint256);
	function functionByIndex           (uint256          _index    ) external view returns(string memory, bytes4, address);
	function functionById              (bytes4           _id       ) external view returns(string memory, bytes4, address);
	function functionExists            (string  calldata _signature) external view returns(bool);
	function functionSignatures        (                           ) external view returns(string memory);
	function delegateFunctionSignatures(address          _delegate ) external view returns(string memory);
	function delegateAddress           (string  calldata _signature) external view returns(address);
	function delegateAddresses         (                           ) external view returns(address[] memory);
}

contract ERC1538QueryDelegate is ERC1538Query, ERC1538
{
	function totalFunctions()
	external view returns(uint256)
	{
		return m_funcSignatures.length;
	}

	function functionByIndex(uint256 _index)
	external view returns(string memory signature, bytes4 id, address delegate)
	{
		bytes4 funcId = bytes4(keccak256(m_funcSignatures[_index]));
		return (string(m_funcSignatures[_index]), funcId, m_funcDelegates[funcId]);
	}

	function functionById(bytes4 _funcId)
	external view returns(string memory signature, bytes4 id, address delegate)
	{
		uint256 index = m_funcIndex[_funcId] - 1;
		return (string(m_funcSignatures[index]), _funcId, m_funcDelegates[_funcId]);
	}

	function functionExists(string calldata _funcSignature)
	external view returns(bool)
	{
		return m_funcDelegates[bytes4(keccak256(bytes(_funcSignature)))] != address(0);
	}

	function delegateAddress(string calldata _funcSignature)
	external view returns(address)
	{
		return m_funcDelegates[bytes4(keccak256(bytes(_funcSignature)))];
	}

	function functionSignatures()
	external view returns(string memory)
	{
		uint256 signaturesLength = 0;
		for (uint256 i = 0; i < m_funcSignatures.length; ++i)
		{
			signaturesLength += m_funcSignatures[i].length + 1; // EDIT
		}

		bytes memory signatures = new bytes(signaturesLength);
		uint256 charPos = 0;
		for (uint256 i = 0; i < m_funcSignatures.length; ++i)
		{
			bytes memory signature = m_funcSignatures[i];
			for (uint256 c = 0; c < signature.length; ++c)
			{
				signatures[charPos] = signature[c];
				++charPos;
			}
			signatures[charPos] = 0x3B;
			++charPos;
		}

		return string(signatures);
	}

	function delegateFunctionSignatures(address _delegate)
	external view returns(string memory)
	{
		bytes[] memory delegateSignatures = new bytes[](m_funcSignatures.length);
		uint256 delegateSignaturesLength = 0;

		uint256 signaturesLength = 0;
		for (uint256 i = 0; i < m_funcSignatures.length; ++i)
		{
			if (_delegate == m_funcDelegates[bytes4(keccak256(m_funcSignatures[i]))])
			{
				bytes memory signature = m_funcSignatures[i];
				signaturesLength += signature.length + 1;
				delegateSignatures[delegateSignaturesLength] = signature;
				++delegateSignaturesLength;
			}
		}

		bytes memory signatures = new bytes(signaturesLength);
		uint256 charPos = 0;
		for (uint256 i = 0; i < delegateSignaturesLength; ++i)
		{
			bytes memory signature = delegateSignatures[i];
			for (uint256 c = 0; c < signature.length; ++c)
			{
				signatures[charPos] = signature[c];
				++charPos;
			}
			signatures[charPos] = 0x3B;
			++charPos;
		}

		return string(signatures);
	}

	function delegateAddresses()
	external view returns(address[] memory)
	{
		address[] memory delegatesBucket = new address[](m_funcSignatures.length);

		uint256 numDelegates = 0;
		for (uint256 i = 0; i < m_funcSignatures.length; ++i)
		{
			address delegate = m_funcDelegates[bytes4(keccak256(m_funcSignatures[i]))];
			bool seen = false;
			for (uint256 j = 0; j < numDelegates; ++j)
			{
				if (delegate == delegatesBucket[j])
				{
					seen = true;
					break;
				}
			}
			if (seen == false)
			{
				delegatesBucket[numDelegates] = delegate;
				++numDelegates;
			}
		}

		address[] memory delegates = new address[](numDelegates);
		for (uint256 i = 0; i < numDelegates; ++i)
		{
			delegates[i] = delegatesBucket[i];
		}
		return delegates;
	}
}
