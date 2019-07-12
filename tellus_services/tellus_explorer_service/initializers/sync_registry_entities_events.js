const registryEntitiesEventsLoader = require('../loaders/registryEntitiesEventsLoader');
const models = require('../models');

const registry_entities_events_loader = new registryEntitiesEventsLoader();

const sync_registry_entities_events = async () => {
  let events = await registry_entities_events_loader.load_all();

  events.map(async (event) => {
    try {
      await models.Transaction.create({
        transactionHash: event.transactionHash,
        blockHash:       event.blockHash,
        blockNumber:     event.blockNumber,
        eventName:       event.event,
        returnValues:    JSON.stringify(event.returnValues)
      });
    } catch (e) {
      console.log(`Can't create Transaction with transactionHash=${event.transactionHash} on sync_registry_entities_events()`);
    }

    try {
      await models.RegistryEntity.create({
        _id: event.returnValues._id,
        title: event.returnValues._title,
        description: event.returnValues._description,
        documents_url: event.returnValues._documents_url,
        image_url: event.returnValues._image_url,
        points: JSON.stringify(event.returnValues._points),
        _created_at: event.returnValues._created_at
      });
    } catch (e) {
      console.log(`Can't create RegistryEntity with event.transactionHash=${event.transactionHash} on sync_registry_entities_events()`);
    }
  });
}

sync_registry_entities_events();