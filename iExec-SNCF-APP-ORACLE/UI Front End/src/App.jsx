import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import "antd/dist/antd.css";
import { StaticJsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import "./App.css";
import { Row, Col, Button, Menu, Alert } from "antd";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useUserAddress } from "eth-hooks";
import { useGasPrice, useContractLoader, useBalance } from "./hooks";
import { Header, Account, Faucet } from "./components";
import { Transactor } from "./helpers";
import { formatEther, parseEther } from "@ethersproject/units";
import { Home } from "./views";
import { INFURA_ID, NETWORK, NETWORKS } from "./constants";


/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS["iExecSidechain"];

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;


// whats event the point of getting your own RPC if you can read without one?
const readProvider = new StaticJsonRpcProvider(targetNetwork.rpcUrl);

function App(props) {

  // injected provider for writing
  const [provider, setWriteProvider] = useState();

  // infura provider pointed at target network for reading
  // wait, can we use infura for mumbai or we need to get our own rpc
  // yes.. we have to use RPC provider. project is already configured for multiple networks
  // including mumbai.
  // const readProvider = new JsonRpcProvider(targetNetwork.rpcUrl);


  /* 🔥 This hook will get the price of Gas from ⛽️ EtherGasStation */
  const gasPrice = useGasPrice(targetNetwork, "fast");

  const address = useUserAddress(provider);

  // You can warn the user if you would like them to be on a specific network
  let selectedChainId = provider?._network?.chainId;
  let localChainId = targetNetwork?.chainId;

  // The transactor wraps transactions and provides notificiations
  const tx = Transactor(provider, gasPrice);

  // Faucet Tx can be used to send funds from the faucet
  const faucetTx = Transactor(provider, gasPrice);

  // it is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(provider, address);

  // // Just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(mainnetProvider, address);

  // Load in your local 📝 contract and read a value from it:
  const readContracts = useContractLoader(readProvider);
  
  //console.log(readContracts);

  let networkDisplay = "";
  if (targetNetwork?.chainId && selectedChainId && targetNetwork.chainId !== selectedChainId) {
    networkDisplay = (
      <div style={{ zIndex: 2, position: "absolute", right: 0, top: 60, padding: 16 }}>
        <Alert
          message={"⚠️ Wrong Network"}
          description={
            <div>
              You have{" "}
              <b>
                {NETWORK(selectedChainId)?.name}({selectedChainId})
              </b>{" "}
              selected and you need to be on{" "}
              <b>
                {NETWORK(targetNetwork?.chainId)?.name} ({localChainId})
              </b>
              .
            </div>
          }
          type="error"
          closable={false}
        />
      </div>
    );
  } else {
    networkDisplay = (
      <div style={{ zIndex: -1, position: "absolute", right: 154, top: 28, padding: 16, color: targetNetwork.color }}>
        {targetNetwork.name}
      </div>
    );
  }

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    // Wrapper for transforming a web3 provider (like metamask)
    setWriteProvider(new Web3Provider(provider));
  }, [setWriteProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  let faucetHint = "";
  const faucetAvailable = provider && provider.connection && targetNetwork.name === "localhost";

  const [faucetClicked, setFaucetClicked] = useState(false);
  if (
    !faucetClicked &&
    provider &&
    provider._network &&
    provider._network.chainId === 31337 &&
    yourLocalBalance &&
    formatEther(yourLocalBalance) <= 0
  ) {
    faucetHint = (
      <div style={{ padding: 16 }}>
        <Button
          type={"primary"}
          onClick={() => {
            faucetTx({
              to: address,
              value: parseEther("0.01"),
            });
            setFaucetClicked(true);
          }}
        >
          <span role="img" aria-label="funds">💰</span> Grab funds from the faucet <span role="img" aria-label="gas">⛽️</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      {networkDisplay}
      <BrowserRouter>
        <Menu style={{ textAlign: "center" }} selectedKeys={[route]} mode="horizontal">
          <Menu.Item key="/">
            <Link
              onClick={() => {
                setRoute("/");
              }}
              to="/"
            >
              
            </Link>
          </Menu.Item>
          
          
        </Menu>

        <Switch>
          <Route exact path="/flight-pronostics-ui">
          {address?
              <Home address={address} readProvider={readProvider} writeProvider={provider} contracts={readContracts} tx={tx}/>
              : <div style={{marginTop: "30px"}}>Connect your wallet to use the Dapp!</div>
            }
          </Route>
          
        </Switch>
      </BrowserRouter>

      {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
      <div style={{ position: "fixed", textAlign: "right", right: 0, top: 0, padding: 10 }}>
        <Account
          address={address}
          provider={provider}
          // price={price}
          web3Modal={web3Modal}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
          blockExplorer={blockExplorer}
        />
        {faucetHint}
      </div>

      {/* 🗺 Extra UI like gas price, eth price, faucet, and support: */}
      <div style={{ position: "fixed", textAlign: "left", left: 0, bottom: 20, padding: 10 }}>
        <Row align="middle" gutter={[4, 4]}>
          <Col span={24}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable ? (
                <Faucet
                  localProvider={provider}
                  // price={price}
                  // ensProvider={provider}
                />
              ) : (
                ""
              )
            }
          </Col>
        </Row>
      </div>
    </div>
  );
}

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

window.ethereum &&
  window.ethereum.on("chainChanged", chainId => {
    setTimeout(() => {
      window.location.reload();
    }, 1);
  });

export default App;
