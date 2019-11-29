var FlightDelayOracle = artifacts.require("FlightDelayOracle");

module.exports = async function(deployer, network, accounts)
{
	await deployer.deploy(FlightDelayOracle, "0x0000000000000000000000000000000000000000", { gas: 2500000 });
	FlightDelayOracleInstance = await FlightDelayOracle.deployed();
	console.log("FlightDelayOracle deployed at address: " + FlightDelayOracleInstance.address);
};
