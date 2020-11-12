var TlsNotaryOracle = artifacts.require("TlsNotaryOracle");

module.exports = async function(deployer, network, accounts)
{
	await deployer.deploy(TlsNotaryOracle, "0x0000000000000000000000000000000000000000", { gas: 2500000 });
	TlsNotaryOracleInstance = await TlsNotaryOracle.deployed();
	console.log("TlsNotaryOracle deployed at address: " + TlsNotaryOracleInstance.address);

};
