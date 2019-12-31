pragma solidity ^0.5.0;

//The Provable `proofType_TLSNotary`: available only on the Ethereum Mainnet
import "./provableAPI_0.5.sol";
//import "../app/tls-notary.js";

contract TLSNotary is usingProvable {

    mapping(bytes32=>bool) validURL;
    event LogNewProvableQuery(string description);
    event LogResult(string result);

    constructor()
        public
    {
        provable_setProof(proofType_TLSNotary | proofStorage_IPFS);
    }

    function __callback(
        bytes32 _queryUrl,
        string memory _result,
        bytes memory _proof
    )
        public
    {
        require(msg.sender == provable_cbAddress());
        emit LogResult(_result);
    }

    function checkUrl(
        string memory _query,
        string memory _method,
        string memory _url,
        string memory _kwargs
    )
        public
        payable
    {
        if (provable_getPrice("computation") > address(this).balance) {
            emit LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
        } else {
            emit LogNewProvableQuery("Provable query was sent, standing by for the answer...");
            provable_query("computation",
                [_query,
                _method,
                _url,
                _kwargs]
            );
        }
    }

    function requestPost()
        public
        payable
    {
        checkUrl("null",
                "POST",
                "../app/tls-notary.js",
                '{"json"}'
                );
    }
    
    
}
