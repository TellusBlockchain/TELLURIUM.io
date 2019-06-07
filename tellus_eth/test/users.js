const Users = artifacts.require("Users");
const truffleCost = require('truffle-cost');

contract('Users', (accounts) => {
  it('should create user', async () => {
    const usersInstance = await Users.deployed();

    result = await truffleCost.log(
      usersInstance.create(
        "0x2af4978cA29Dfe3D402b76Ec946785f1E84Ed82c",
        0
      ),
      'USD'
    );
  });
});
