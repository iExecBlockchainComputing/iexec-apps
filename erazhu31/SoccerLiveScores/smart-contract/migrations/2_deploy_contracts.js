var PriceOracle = artifacts.require("PriceOracle");

module.exports = async function(deployer, network, accounts)
{
	await deployer.deploy(PriceOracle, "0x0000000000000000000000000000000000000000", { gas: 2500000 });
	PriceOracleInstance = await PriceOracle.deployed();
	console.log("PriceOracle deployed at address: " + PriceOracleInstance.address);

};
