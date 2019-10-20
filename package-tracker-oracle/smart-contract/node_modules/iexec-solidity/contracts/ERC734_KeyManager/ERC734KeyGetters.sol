pragma solidity ^0.5.0;

import "./KeyStoreLib.sol";
import "./ERC734KeyBase.sol";

/// @title KeyManager
/// @author Mircea Pasoi
/// @notice Implement getter functions from ERC734 spec
/// @dev Key data is stored using KeyStore library

contract ERC734KeyGetters is ERC734KeyBase
{
	/// @dev Number of keys managed by the contract
	/// @return Unsigned integer number of keys
	function numKeys()
	external
	view
	returns (uint)
	{
		return m_keys.count;
	}

	/// @dev Find the key data, if held by the identity
	/// @param _key Key bytes to find
	/// @return `(purposes, keyType, key)` tuple if the key exists
	function getKey(bytes32 _key)
	external
	view
	returns(uint256[] memory purposes, uint256 keyType, bytes32 key)
	{
		KeyStoreLib.Key storage k = m_keys.keys[_key];
		purposes = k.purposes;
		keyType  = k.keyType;
		key      = k.key;
	}

	/// @dev Find if a key has is present and has the given purpose
	/// @param _key Key bytes to find
	/// @param purpose Purpose to find
	/// @return Boolean indicating whether the key exists or not
	function keyHasPurpose(bytes32 _key, uint256 purpose)
	external
	view
	returns(bool exists)
	{
		return m_keys.find(_key, purpose);
	}

	/// @dev Find all the keys held by this identity for a given purpose
	/// @param _purpose Purpose to find
	/// @return Array with key bytes for that purpose (empty if none)
	function getKeysByPurpose(uint256 _purpose)
	external
	view
	returns(bytes32[] memory keys)
	{
		return m_keys.keysByPurpose[_purpose];
	}
}
