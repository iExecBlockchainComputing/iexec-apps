var AnemometerOracle = artifacts.require("AnemometerOracle");

module.exports = async function(deployer, network, accounts)
{
	await deployer.deploy(AnemometerOracle, "0x0000000000000000000000000000000000000000", { gas: 2500000 });
	AnemometerOracleInstance = await AnemometerOracle.deployed();
	console.log("AnemometerOracle deployed at address: " + AnemometerOracleInstance.address);
};
