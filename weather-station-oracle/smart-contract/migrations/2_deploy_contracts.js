var WeatherStationOracle = artifacts.require("WeatherStationOracle");

module.exports = async function(deployer, network, accounts)
{
	await deployer.deploy(WeatherStationOracle, "0x0000000000000000000000000000000000000000", { gas: 2500000 });
	WeatherStationOracleInstance = await WeatherStationOracle.deployed();
	console.log("WeatherStationOracle deployed at address: " + WeatherStationOracleInstance.address);
};