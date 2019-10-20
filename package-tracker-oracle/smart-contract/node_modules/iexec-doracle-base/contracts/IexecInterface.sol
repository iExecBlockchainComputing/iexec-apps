pragma solidity ^0.5.8;
pragma experimental ABIEncoderV2;

import "./iexec-poco-interfaces/IexecHubInterface.sol";
import "./iexec-poco-interfaces/IexecClerkInterface.sol";


contract IexecInterface
{
	address constant IEXEC_HUB_MAINNET = 0x1383c16c927c4A853684d1a9c676986f25E22111;
	address constant IEXEC_HUB_ROPSTEN = 0xDbe30645EA7d216c31D09f8c5736FE74de774e63;
	address constant IEXEC_HUB_RINKEBY = 0x0000000000000000000000000000000000000000;
	address constant IEXEC_HUB_KOVAN   = 0xb3901d04CF645747b99DBbe8f2eE9cb41A89CeBF;
	address constant IEXEC_HUB_GOERLI  = 0x0000000000000000000000000000000000000000;

	IexecHubInterface   public iexecHub;
	IexecClerkInterface public iexecClerk;

	constructor(address _iexecHubAddr)
	public
	{
		if      (getCodeSize(_iexecHubAddr    ) > 0) { iexecHub = IexecHubInterface(_iexecHubAddr    ); }
		else if (getCodeSize(IEXEC_HUB_MAINNET) > 0) { iexecHub = IexecHubInterface(IEXEC_HUB_MAINNET); }
		else if (getCodeSize(IEXEC_HUB_ROPSTEN) > 0) { iexecHub = IexecHubInterface(IEXEC_HUB_ROPSTEN); }
		else if (getCodeSize(IEXEC_HUB_RINKEBY) > 0) { iexecHub = IexecHubInterface(IEXEC_HUB_RINKEBY); }
		else if (getCodeSize(IEXEC_HUB_KOVAN  ) > 0) { iexecHub = IexecHubInterface(IEXEC_HUB_KOVAN  ); }
		else if (getCodeSize(IEXEC_HUB_GOERLI ) > 0) { iexecHub = IexecHubInterface(IEXEC_HUB_GOERLI ); }
		else                                         { revert("invalid-hub-address");                   }
		iexecClerk = IexecClerkInterface(iexecHub.iexecclerk());
	}

	function getCodeSize(address _addr)
	internal view returns (uint _size)
	{
		assembly { _size := extcodesize(_addr) }
	}
}
