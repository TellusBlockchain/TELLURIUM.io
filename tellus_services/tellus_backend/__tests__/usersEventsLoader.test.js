const models = require('../models');

const usersEventsLoader = require('../loaders/usersEventsLoader');

describe('Registry Entities synchronizer', () => {
  beforeEach( async () => {
    // await models.Transaction.sync({ force: true });
    // await models.RegistryEntity.sync({ force: true });
  });

  afterAll( () => {
    // models.Transaction.sequelize.close();
  });

  test('tries to load all Users events from blockchain', async () => {
    const users_events_loader = new usersEventsLoader();
    let users_events = await users_events_loader.load_all();
    expect( Array.isArray(users_events) ).toBe(true);
    expect( users_events.length ).toBe(13);
  });
});