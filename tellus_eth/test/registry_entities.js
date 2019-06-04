const RegistryEntities = artifacts.require("RegistryEntities");
const truffleCost = require('truffle-cost');

contract('RegistryEntities', (accounts) => {
  it('should create registry entity', async () => {
    const registryEntitiesInstance = await RegistryEntities.deployed();

    result = await truffleCost.log(
      registryEntitiesInstance.create(
          "title",
          "description",
          "documents_url",
          "image_url",
          [ 1, 2, 3]
      ),
      'USD'
    );

  });
});
