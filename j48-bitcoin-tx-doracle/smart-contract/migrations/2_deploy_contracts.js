var BitcoinTxDoracle = artifacts.require("BitcoinTxDoracle");

module.exports = async function(deployer, network, accounts)
{
	await deployer.deploy(BitcoinTxDoracle, "0x0000000000000000000000000000000000000000", { gas: 2500000 });
	BitcoinTxDoracleInstance = await BitcoinTxDoracle.deployed();
	console.log("BitcoinTxDoracle deployed at address: " + BitcoinTxDoracleInstance.address);
};