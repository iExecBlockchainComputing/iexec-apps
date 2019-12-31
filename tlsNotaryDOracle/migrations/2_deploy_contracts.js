var Adoption = artifacts.require("TLSNotary");

module.exports = function(deployer) {
    deployer.deploy(TLSNotary);
}