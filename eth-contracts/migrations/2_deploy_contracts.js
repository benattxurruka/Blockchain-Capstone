// migrating the appropriate contracts
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  deployer.deploy(SolnSquareVerifier);
};
