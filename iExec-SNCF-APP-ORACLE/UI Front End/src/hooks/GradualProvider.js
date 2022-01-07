// import { useMemo } from "react";
// import { Web3Provider } from "@ethersproject/providers";
// import BurnerProvider from "burner-provider";
// import { INFURA_ID } from "../constants";

import { useEffect } from "react";


/*
  Either read only infura if no wallet is installed,
  or injected Web3 provider from metamask

  // STEPS:
  // create web3Modal object
  // effect: 
    if modal cached provider: await connect and inject web3
    if you have a wallet you must connect.
  // else if no wallet installed:
    // use infura read only provider (but how? will web3modal be null?)




  // if metamask:
  // need to wrap web3. 
  //

*/

export default function useGradualProvider(eth) {
  useEffect(() => {    
    console.log('gradual provider eth detected:', eth);
  }, [eth])

  return eth
}