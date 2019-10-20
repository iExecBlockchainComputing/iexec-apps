pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

library ECDSALib
{
	struct signature
	{
		uint8   v;
		bytes32 r;
		bytes32 s;
	}

	function recover(bytes32 hash, signature memory sign)
	public pure returns (address)
	{
		require(sign.v == 27 || sign.v == 28);
		return ecrecover(hash, sign.v, sign.r, sign.s);
	}

	function recover(bytes32 hash, bytes memory sign)
	public pure returns (address)
	{
		bytes32 r;
		bytes32 s;
		uint8   v;
		require(sign.length == 65);
		assembly
		{
			r :=         mload(add(sign, 0x20))
			s :=         mload(add(sign, 0x40))
			v := byte(0, mload(add(sign, 0x60)))
		}
		if (v < 27) v += 27;
		require(v == 27 || v == 28);
		return ecrecover(hash, v, r, s);
	}

	function toEthSignedMessageHash(bytes32 hash)
	public pure returns (bytes32)
	{
		return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
	}

	function toEthTypedStructHash(bytes32 struct_hash, bytes32 domain_separator)
	public pure returns (bytes32)
	{
		return keccak256(abi.encodePacked("\x19\x01", domain_separator, struct_hash));
	}
}
