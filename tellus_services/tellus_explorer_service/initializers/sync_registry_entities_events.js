const registryEntitiesEventsLoader = require('../loaders/registryEntitiesEventsLoader');
const models = require('../models');

const registry_entities_events_loader = new registryEntitiesEventsLoader();

const sync_registry_entities_events = async () => {
  let events = await registry_entities_events_loader.load_all();
  events.map(async (event) => {
    await models.Transaction.create({
      transactionHash: event.transactionHash,
      blockHash: event.blockHash,
      blockNumber: event.blockNumber,
      eventName: event.event,
      returnValues: JSON.stringify(event.returnValues)
    });
  });
}

sync_registry_entities_events();