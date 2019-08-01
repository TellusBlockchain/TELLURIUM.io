const models = require('../models');

const registryEntitiesEventsLoader = require('../loaders/registryEntitiesEventsLoader');

describe('Registry Entities synchronizer', () => {
  beforeEach( async () => {
    await models.Transaction.sync({ force: true });
    await models.RegistryEntity.sync({ force: true });
  });

  afterAll( () => {
    models.Transaction.sequelize.close();
  });

  test('tries to load all Registry Entities events from blockchain', async () => {
    const registry_entities_events_loader = new registryEntitiesEventsLoader();
    let registry_entities_events = await registry_entities_events_loader.load_all();
    expect(Array.isArray(registry_entities_events)).toBe(true);
    expect(registry_entities_events.length).toBe(26);
  });

  test('tries to load all Registry Entities events from blockchain and save them like Transaction and RegistryEntity models in local database', async () => {
    const registry_entities_events_loader = new registryEntitiesEventsLoader();
    await registry_entities_events_loader.sync_registry_entities_events();

    let transactions;
    try {
      transactions = await models.Transaction.findAll({
        order: [
          ['blockNumber', 'DESC']
        ]
      });
    } catch (err) {
      console.log(err);
    }

    expect(transactions.length).toBe(26);

    let registry_entities;
    try {
      registry_entities = await models.RegistryEntity.findAll({
        order: [
          ['_id', 'DESC']
        ]
      });
    } catch (err) {
      console.log(err);
    }

    expect(registry_entities.length).toBe(26);
  });

  test('checks that transactions table in test database is empty', async () => {
    let transactions;
    try {
      transactions = await models.Transaction.findAll({
        order: [
          ['blockNumber', 'DESC']
        ]
      });
    } catch (err) {
      console.log(err);
    }

    expect(transactions.length).toBe(0);
  });

  test('checks that registry_entities table in test database is empty', async () => {
    let registry_entities;
    try {
      registry_entities = await models.RegistryEntity.findAll({
        order: [
          ['_id', 'DESC']
        ]
      });
    } catch (err) {
      console.log(err);
    }

    expect(registry_entities.length).toBe(0);
  });
});