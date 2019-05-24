const LandEntries = artifacts.require("LandEntries");
const Users = artifacts.require("Users");

module.exports = function(deployer) {
  deployer.deploy(LandEntries);
  deployer.deploy(Users);
};
