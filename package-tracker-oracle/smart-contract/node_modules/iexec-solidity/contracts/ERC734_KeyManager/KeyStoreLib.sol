pragma solidity ^0.5.0;

/// @title KeyStorage
/// @author Mircea Pasoi
/// @notice Library for managing an arrray of ERC 734 keys

library KeyStoreLib
{
	struct Key
	{
		uint256[] purposes; //e.g., MANAGEMENT_KEY = 1, ACTION_KEY = 2, etc.
		uint256   keyType; // e.g. 1 = ECDSA, 2 = RSA, etc.
		bytes32   key; // for non-hex and long keys, its the Keccak256 hash of the key
	}

	struct Keys
	{
		mapping (bytes32 => Key      ) keys;
		mapping (uint256 => bytes32[]) keysByPurpose;
		uint256                        count;
	}

	/// @dev Find a key + purpose tuple
	/// @param key Key bytes to find
	/// @param purpose Purpose to find
	/// @return `true` if key + purpose tuple if found
	function find(Keys storage self, bytes32 key, uint256 purpose)
	internal
	view
	returns (bool found)
	{
		Key memory k = self.keys[key];
		if (k.key == 0)
		{
			return false;
		}
		for (uint256 i = 0; i < k.purposes.length; ++i)
		{
			if (k.purposes[i] == purpose)
			{
				return true;
			}
		}
		return false;
	}

	/// @dev Add a Key
	/// @param key Key bytes to add
	/// @param purpose Purpose to add
	/// @param keyType Key type to add
	function add(Keys storage self, bytes32 key, uint256 purpose, uint256 keyType)
	internal
	{
		Key storage k = self.keys[key];
		k.purposes.push(purpose);
		if (k.key == 0)
		{
			k.key     = key;
			k.keyType = keyType;
		}
		self.keysByPurpose[purpose].push(key);
		self.count++;
	}

	/// @dev Remove Key
	/// @param key Key bytes to remove
	/// @param purpose Purpose to remove
	/// @return Key type of the key that was removed
	function remove(Keys storage self, bytes32 key, uint256 purpose)
	internal
	returns (uint256 keyType)
	{
		keyType = self.keys[key].keyType;

		uint256[] storage p = self.keys[key].purposes;
		// Delete purpose from keys
		for (uint256 i = 0; i < p.length; ++i)
		{
			if (p[i] == purpose)
			{
				p[i] = p[p.length - 1];
				delete p[p.length - 1];
				p.length--;
				self.count--;
				break;
			}
		}
		// No more purposes
		if (p.length == 0)
		{
			delete self.keys[key];
		}

		// Delete key from keysByPurpose
		bytes32[] storage k = self.keysByPurpose[purpose];
		for (uint256 i = 0; i < k.length; ++i)
		{
			if (k[i] == key)
			{
				k[i] = k[k.length - 1];
				delete k[k.length - 1];
				k.length--;
				break;
			}
		}
	}
}
