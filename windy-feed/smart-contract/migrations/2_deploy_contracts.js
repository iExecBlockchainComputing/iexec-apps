var WindOracle = artifacts.require("WindOracle");

module.exports = async function(deployer, network, accounts)
{
	await deployer.deploy(WindOracle, "0x0000000000000000000000000000000000000000", { gas: 2500000 });
	WindOracleInstance = await WindOracle.deployed();
	console.log("WindOracle deployed at address: " + WindOracleInstance.address);
};