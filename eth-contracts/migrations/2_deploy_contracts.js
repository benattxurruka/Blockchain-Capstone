// migrating the appropriate contracts
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier");

module.exports = function(deployer) {
  deployer.deploy(SolnSquareVerifier);
};
