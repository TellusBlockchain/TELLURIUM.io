const LandEntries = artifacts.require("LandEntries");
const truffleCost = require('truffle-cost');

contract('LandEntries', (accounts) => {
  it('should create land entry', async () => {
    const landEntriesInstance = await LandEntries.deployed();

    result = await truffleCost.log(
      landEntriesInstance.create(
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
