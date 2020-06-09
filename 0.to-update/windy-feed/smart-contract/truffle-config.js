var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports =
{
	networks:
	{
		docker:
		{
			host:       "iexec-geth-local",
			port:       8545,
			network_id: "*", // Match any network id,
			gasPrice:   22000000000, //22Gwei
		},
		development:
		{
			host:       "localhost",
			port:       8545,
			network_id: "*", // Match any network id,
			gasPrice:   22000000000, //22Gwei
		},
		coverage:
		{
			host:       "localhost",
			port:       8555,          // <-- If you change this, also set the port option in .solcover.js.
			network_id: "*",
			gas:        0xFFFFFFFFFFF, // <-- Use this high gas value
			gasPrice:   0x01           // <-- Use this low gas price
		},
		mainnet:
		{
			provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://mainnet.infura.io/v3/f3e0664e01504f5ab2b4360853ce0dc7"),
			network_id: '1',
			gasPrice:   22000000000, //22Gwei
		},
		ropsten:
		{
			provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://ropsten.infura.io/v3/f3e0664e01504f5ab2b4360853ce0dc7"),
			network_id: '3',
			gasPrice:   22000000000, //22Gwei
		},
		kovan: {
			provider: () => new HDWalletProvider(process.env.MNEMONIC, "https://kovan.infura.io/v3/f3e0664e01504f5ab2b4360853ce0dc7"),
			network_id: '42',
			gasPrice:   1000000000, //1Gwei
		}
	},
	compilers: {
		solc: {
			version: "0.5.10",
			settings: {
				optimizer: {
					enabled: true,
					runs: 200
				}
			}
		}
	},
	mocha:
	{
		enableTimeouts: false
	}
};
