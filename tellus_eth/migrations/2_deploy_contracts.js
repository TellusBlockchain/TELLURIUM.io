const RegistryEntities = artifacts.require("RegistryEntities");
const Users = artifacts.require("Users");

module.exports = function(deployer) {
  deployer.deploy(RegistryEntities);
  deployer.deploy(Users);
};
