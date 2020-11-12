const HDWalletProvider = require("@truffle/hdwallet-provider");
const MNENOMIC=0xf178b033d1fc328af07ab66ca30358ed5cd77a5c8d499d06f47c404656707910
require('dotenv').config();

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    develop: {
      port: 8545
    },
    kovan: {
      provider: () => new HDWalletProvider(`https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`),
      network_id: 42,
      gas: 3000000,
      gasPrice: 10000000000
    },
  }
};
