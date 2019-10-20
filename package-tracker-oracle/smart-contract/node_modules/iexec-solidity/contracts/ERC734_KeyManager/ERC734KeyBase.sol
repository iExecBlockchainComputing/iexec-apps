pragma solidity ^0.5.0;

import "./IERC734.sol";
import "./KeyStoreLib.sol";

/// @title KeyManager
/// @author Mircea Pasoi
/// @notice Abstract contract for ERC734 implementation
/// @dev Key data is stored using KeyStore library

contract ERC734KeyBase is IERC734
{
	// Key storage
	using KeyStoreLib for KeyStoreLib.Keys;
	KeyStoreLib.Keys internal m_keys;

	/// @dev Convert an Ethereum address (20 bytes) to an ERC734 key (32 bytes)
	function addrToKey(address addr)
	public
	pure
	returns (bytes32)
	{
		return keccak256(abi.encodePacked(addr));
	}

	// For multi-sig
	uint256 public managementThreshold = 1;
	uint256 public actionThreshold     = 1;

	/// @dev Modifier that only allows keys of purpose 1, or the identity itself
	modifier onlyManagement
	{
		if (msg.sender != address(this))
		{
			require(managementThreshold == 1 && m_keys.find(addrToKey(msg.sender), MANAGEMENT_KEY), "only-management");
		}
		_;
	}
}
