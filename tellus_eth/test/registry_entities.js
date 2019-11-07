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
      "5000.00",
      [ 1, 2, 3 ],
      {value: 100000000000000000}
    );
    assert.equal(result.logs[0].event, 'AfterRegistryEntityCreated');
    assert.equal(result.logs[0].args['_creator_addr'], '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1');
    result = await truffleCost.log(result, 'USD');
  });

  it('should fail on create registry entity with not enough Ether', async () => {
    const registryEntitiesInstance = await RegistryEntities.deployed();

    try {
      await registryEntitiesInstance.create(
        "title",
        "description",
        "documents_url",
        "image_url",
        "5000.00",
        [ 1, 2, 3 ],
        {value: 10000000000000000}
      );
    } catch (err) {
      expect( err["reason"] ).to.eql( "Not enough Ether provided." );
    }
  });
});
