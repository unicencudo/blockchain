var silscontract = artifacts.require("SILS");
var safemath = artifacts.require("SafeMath");

module.exports = function(deployer) {
    deployer.deploy(silscontract);
    deployer.deploy(safemath);
};