// MY INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = "47354c4ae0f24d918a987cd667da4f15";

//MY ETHERSCAN_ID, SWAP IN YOURS FROM https://etherscan.io/myapikey
export const ETHERSCAN_KEY = "PSW8C433Q667DVEX5BCRMGNAH9FSGFZ7Q8";

//BLOCKNATIVE ID FOR Notify.js:
export const BLOCKNATIVE_DAPPID = "0b58206a-f3c0-4701-a62f-73c7243e8c77";

export const NETWORK = chainId => {
  for (let n in NETWORKS) {
    if (NETWORKS[n].chainId === chainId) {
      return NETWORKS[n];
    }
  }
};

// "Beeple EDM" Dummy Prize NFT
export const SAMPLE_JSON_URI = "https://api.jsonbin.io/b/6096ed6b8211bb127e382e89";
// Liens of new york
export const LIENS_OF_NEW_YORK_URI = "https://api.jsonbin.io/b/608432b348f71c7a71cd4389/3";

export const STARRY_NIGHT = "https://api.jsonbin.io/b/6097eec87a19ef1245a63194";

// "Golden Ticket"; raffle owners can use their own ticket NFT template if they choose"
// Using "Dice Roll" for now


export const IPFS_GATEWAY_URL = 'https://ipfs.infura.io';
export const CUSTOM_WORKERPOOL_MAP = {
  // use tee prod pools only
  1: '0x54490A494762630aD11938442b8760Ed81E0a7E8', //v6.prod-main-pool.mainnet.iex.ec
  133: '0xAd0b7eFEc0ABF34421B668ea7bCadaC12Dd97541', // v6.prod-main-pool.viviani.iex.ec
  134: '0xC3ba8b42C0Ca50dA42B2983F38F62348171D8Ea4', // v6.prod-main-pool.bellecour.iex.ec
};
export const PROVIDER_ENDPOINT_MAP = {
  1: 'mainnet',
  5: 'goerli',
  133: 'https://viviani.iex.ec',
  134: 'https://bellecour.iex.ec',
};
export const ACK_KEY = 'e883403e293a6da931a43c8d2b5909bc8a463295fb46f33484a6d1350868f56d';
export const ORACLE_CID = 'QmZwEyu2gvTMydqq5QGQJDtsKpragn8tuiWbe8jMZmQBHi';
export const CUSTOM_WORKERPOOL_MA ='0xAd0b7eFEc0ABF34421B668ea7bCadaC12Dd97541';  



// https://hardhat.org/metamask-issue.html
// metamask assumes 1337 so you need to change its chain ID for local network
export const NETWORKS = {
  localhost: {
    name: "localhost",
    color: "#666666",
    chainId: 31337,
    blockExplorer: "",
    rpcUrl: "http://" + window.location.hostname + ":8545",
  },
  mainnet: {
    name: "mainnet",
    color: "#ff8b9e",
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://etherscan.io/",
  },
  kovan: {
    name: "kovan",
    color: "#7003DD",
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    blockExplorer: "https://kovan.etherscan.io/",
    faucet: "https://gitter.im/kovan-testnet/faucet", //https://faucet.kovan.network/
  },
  rinkeby: {
    name: "rinkeby",
    color: "#e0d068",
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: "https://faucet.rinkeby.io/",
    blockExplorer: "https://rinkeby.etherscan.io/",
  },
  ropsten: {
    name: "ropsten",
    color: "#F60D09",
    chainId: 3,
    faucet: "https://faucet.ropsten.be/",
    blockExplorer: "https://ropsten.etherscan.io/",
    rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    chainId: 5,
    faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
  },
  xdai: {
    name: "xdai",
    color: "#48a9a6",
    chainId: 100,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://dai.poa.network",
    faucet: "https://xdai-faucet.top/",
    blockExplorer: "https://blockscout.com/poa/xdai/",
  },
  matic: {
    name: "matic",
    color: "#2bbdf7",
    chainId: 137,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc-mainnet.maticvigil.com",
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://explorer-mainnet.maticvigil.com//",
  },
  mumbai: {
    name: "mumbai",
    color: "#92D9FA",
    chainId: 80001,
    price: 1,
    gasPrice: 1000000000,
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    faucet: "https://faucet.matic.network/",
    blockExplorer: "https://mumbai-explorer.matic.today/",
  },
  iExecSidechain: {
    name: "iExec Test Sidechain",
    color: "#92D9FA",
    chainId: 133,
    gasPrice: 0,
    rpcUrl: "https://viviani.iex.ec",
    faucet: "https://faucet.iex.ec/viviani",
    blockExplorer: "https://explorer.iex.ec/viviani/",
  },

};
