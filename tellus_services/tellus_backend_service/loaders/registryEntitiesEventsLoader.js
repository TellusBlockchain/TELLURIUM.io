const models = require('../models');

const Web3 = require('web3');
const web3 = new Web3(process.env.WEB3_PROVIDER);

const RegistryEntitiesJSON = require("../../tellus_react/src/contracts/RegistryEntities.json");
let RegistryEntitiesContract = new web3.eth.Contract(
  RegistryEntitiesJSON.abi,
  RegistryEntitiesJSON["networks"][process.env.ETHEREUM_NETWORK]["address"]
);

/**
 * This class is used to load Registry Entities events from blockchain.
 */
class registryEntitiesEventsLoader {
  
  /** 
   * This function loads all 'AfterRegistryEntityCreated' events.
   * @returns {Array} Array of all 'AfterRegistryEntityCreated' events.
  */
  async load_all() {
    let events = await RegistryEntitiesContract.getPastEvents("AfterRegistryEntityCreated", {
      // TODO: change fromBlock to block in which transaction of contract uploading occured
      fromBlock: 0
    });
    return events;
  }
  
  async sync_registry_entities_events() {
    let events = await this.load_all();
  
    await Promise.all(events.map(async (event) => {
      try {
        await models.Transaction.create({
          transactionHash: event.transactionHash,
          blockHash:       event.blockHash,
          blockNumber:     event.blockNumber,
          eventName:       event.event,
          returnValues:    JSON.stringify(event.returnValues)
        });
        // console.log(`Successfully created Transaction with transactionHash=${event.transactionHash}`);
      } catch (err) {
        console.log(`Can't create Transaction with transactionHash=${event.transactionHash}`);
        console.log(err);
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
        // console.log(`Successfully created RegistryEntity with transactionHash=${event.transactionHash}`);
      } catch (err) {
        console.log(`Can't create RegistryEntity with transactionHash=${event.transactionHash}`);
        console.log(err);
      }
    }));
  }
}

module.exports = registryEntitiesEventsLoader;