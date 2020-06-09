var LaPosteOracle = artifacts.require("LaPosteOracle");

module.exports = async function(deployer, network, accounts)
{
	await deployer.deploy(LaPosteOracle, "0x0000000000000000000000000000000000000000", { gas: 2500000 });
	LaPosteOracleInstance = await LaPosteOracle.deployed();
	console.log("LaPosteOracle deployed at address: " + LaPosteOracleInstance.address);
};