const RegistryEntities = artifacts.require("RegistryEntities");
const truffleCost = require('truffle-cost');

contract('RegistryEntities', (accounts) => {
  it('should create registry entity', async () => {
    const registryEntitiesInstance = await RegistryEntities.deployed();

    let result = await registryEntitiesInstance.create(
      "title",
      "description",
      "documents_url",
      "image_url",
      [ 1, 2, 3 ]
    );
    assert.equal(result.logs[0].event, 'AfterRegistryEntityCreated');
    result = await truffleCost.log(result, 'USD');
  });
});
