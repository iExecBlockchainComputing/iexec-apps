pragma solidity ^0.5.0;

import "../Libs/SafeMath.sol";
import "../Libs/ECDSALib.sol";

import "../ERC20_Token/IERC20.sol";
import "../ERC734_KeyManager/ERC734.sol";
import "./IERC1077.sol";

contract ERC1077 is IERC1077, ERC734
{
	using SafeMath for uint256;
	using ECDSALib for bytes32;

	mapping(bytes32 => uint256) m_keynonces;

	function keyNonce(bytes32 _key)
	external view returns (uint256)
	{
		return m_keynonces[_key];
	}

	function executeSigned(
		address        _to,
		uint256        _value,
		bytes calldata _data,
		uint256        _nonce,
		uint256        _gasLimit,
		uint256        _gasPrice,
		address        _gasToken,
		bytes calldata _signature
	)
	external returns (uint256)
	{
		uint256 gasBefore = gasleft();

		bytes32 key = addrToKey(
			keccak256(abi.encode(
				address(this),
				_to,
				_value,
				_data,
				_nonce,
				_gasLimit,
				_gasPrice,
				_gasToken
			))
			.toEthSignedMessageHash()
			.recover(_signature)
		);

		// Check nonce & increment
		require(_nonce == ++m_keynonces[key], "Invalid nonce");

		uint256 executionId = __execute(key, _to, _value, _data);

		refund(gasBefore.sub(gasleft()).min(_gasLimit), _gasPrice, _gasToken);
		return executionId;
	}

	function approveSigned(
		uint256        _id,
		bool           _value,
		uint256        _nonce,
		uint256        _gasLimit,
		uint256        _gasPrice,
		address        _gasToken,
		bytes calldata _signature
	)
	external returns (bool)
	{
		uint256 gasBefore = gasleft();

		bytes32 key = addrToKey(
			keccak256(abi.encode(
				address(this),
				_id,
				_value,
				_nonce,
				_gasLimit,
				_gasPrice,
				_gasToken
			))
			.toEthSignedMessageHash()
			.recover(_signature)
		);

		// Check nonce
		require(_nonce == m_keynonces[key], "Invalid nonce");
		m_keynonces[key]++;

		bool success = __approve(key, _id, _value);

		refund(gasBefore.sub(gasleft()).min(_gasLimit), _gasPrice, _gasToken);
		return success;
	}

	function refund(uint256 gasUsed, uint256 gasPrice, address gasToken)
	private
	{
		if (gasToken == address(0))
		{
			msg.sender.transfer(gasUsed.mul(gasPrice));
		}
		else
		{
			IERC20(gasToken).transfer(msg.sender, gasUsed.mul(gasPrice));
		}
	}
}
