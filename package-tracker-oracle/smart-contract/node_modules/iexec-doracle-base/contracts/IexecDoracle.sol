pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "iexec-poco/contracts/SignatureVerifier.sol";
import "iexec-solidity/contracts/ERC1154_OracleInterface/IERC1154.sol";
import "./IexecInterface.sol";


contract IexecDoracle is IexecInterface, SignatureVerifier, IOracleConsumer
{
	address public m_authorizedApp;
	address public m_authorizedDataset;
	address public m_authorizedWorkerpool;
	bytes32 public m_requiredtag;
	uint256 public m_requiredtrust;

	event ResultReady(bytes32 indexed doracleCallId);

	constructor(address _iexecHubAddr)
	public IexecInterface(_iexecHubAddr)
	{}

	function receiveResult(bytes32 _doracleCallId, bytes calldata)
	external
	{
		emit ResultReady(_doracleCallId);
	}

	function _iexecDoracleUpdateSettings(
		address _authorizedApp
	,	address _authorizedDataset
	,	address _authorizedWorkerpool
	, bytes32 _requiredtag
	, uint256 _requiredtrust
	)
	internal
	{
		m_authorizedApp        = _authorizedApp;
		m_authorizedDataset    = _authorizedDataset;
		m_authorizedWorkerpool = _authorizedWorkerpool;
		m_requiredtag          = _requiredtag;
		m_requiredtrust        = _requiredtrust;
	}

	function _iexecDoracleGetResults(bytes32 _doracleCallId)
	internal view returns (bool, bytes memory)
	{
		IexecODBLibCore.Task memory task = iexecHub.viewTask(_doracleCallId);
		IexecODBLibCore.Deal memory deal = iexecClerk.viewDeal(task.dealid);

		if (task.status != IexecODBLibCore.TaskStatusEnum.COMPLETED                                                                                  ) { return (false, bytes("result-not-available"             ));  }
		if (task.resultDigest != keccak256(task.results)                                                                                             ) { return (false, bytes("result-not-validated-by-consensus"));  }
		if (m_authorizedApp        != address(0) && !checkIdentity(m_authorizedApp,        deal.app.pointer,        iexecClerk.GROUPMEMBER_PURPOSE())) { return (false, bytes("unauthorized-app"                 ));  }
		if (m_authorizedDataset    != address(0) && !checkIdentity(m_authorizedDataset,    deal.dataset.pointer,    iexecClerk.GROUPMEMBER_PURPOSE())) { return (false, bytes("unauthorized-dataset"             ));  }
		if (m_authorizedWorkerpool != address(0) && !checkIdentity(m_authorizedWorkerpool, deal.workerpool.pointer, iexecClerk.GROUPMEMBER_PURPOSE())) { return (false, bytes("unauthorized-workerpool"          ));  }
		if (m_requiredtag & ~deal.tag != bytes32(0)                                                                                                  ) { return (false, bytes("invalid-tag"                      ));  }
		if (m_requiredtrust > deal.trust                                                                                                             ) { return (false, bytes("invalid-trust"                    ));  }
		return (true, task.results);
	}

	function _iexecDoracleGetVerifiedResult(bytes32 _doracleCallId)
	internal view returns (bytes memory)
	{
		(bool success, bytes memory results) = _iexecDoracleGetResults(_doracleCallId);
		require(success, string(results));
		return results;
	}
}
