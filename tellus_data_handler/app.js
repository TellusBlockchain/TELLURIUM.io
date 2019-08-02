const LAT_LNG_DIVIDER = 1000000;

const Web3 = require('web3');
const HDWalletProvider = require("truffle-hdwallet-provider");

let provider = new HDWalletProvider(
  process.env.DEPLOYER_PRIVATE_KEY,
  process.env.INFURA_PROJECT_URL
);

const fs = require('fs');

// const web3 = new Web3(process.env.WEB3_PROVIDER);
const web3 = new Web3(provider);

const ipfsClient = require('ipfs-http-client');

const ipfs = ipfsClient(
  process.env.IPFS_API_SERVER_URL,
  process.env.IPFS_API_SERVER_PORT
);

const RegistryEntitiesJSON = require("../tellus_services/tellus_react/src/contracts/RegistryEntities.json");

const RegistryEntitiesContract = new web3.eth.Contract(
  RegistryEntitiesJSON.abi,
  RegistryEntitiesJSON["networks"][process.env.ETHEREUM_NETWORK]["address"]
);

const data = require('./data/192072450_RESI_65E2.json');

const fields = [
  "ML Number",
  "Address",
  "Public Comments",
  "Latitude",
  "Longitude"
];

let sanitized_data = [];
fields.forEach(function (field) {
  Object.keys(data[field]).forEach( function (k) {
    k = k >> 0;
    if ( !sanitized_data[k] ) {
      sanitized_data[k] = {}
    }
    sanitized_data[k][field] = data[field][k];
  });
});

async function start_upload_data_to_tellus () {
  var stream = fs.createWriteStream("handled.txt", { flags: 'a' });
  let data, result, image_url, documents_url, points;

  for (let i = 0, l = sanitized_data.length; i < l; i++) {
    data = sanitized_data[i];

    console.log(`Trying to handle data with ML Number=${data['ML Number']}`)

    try {
      result = await ipfs.addFromFs(`./data/192072450_RESI_65E2/${data['ML Number']}_1.jpg`);

      image_url = `${process.env.IPFS_GATEWAY_URL}/ipfs/${result[0].hash}`;
      documents_url = '';
      points = [
        Math.round(data['Latitude']*LAT_LNG_DIVIDER),
        Math.round(data['Longitude']*LAT_LNG_DIVIDER),
        0
      ];

      try {
        await RegistryEntitiesContract.methods
          .create(data['Address'], data['Public Comments'], documents_url, image_url, points)
          .send({
            from: process.env["ADMIN_ADDRESS"],
            gas: 1000000
          });
        stream.write(data['ML Number'] + "\n");
        console.log(`Successfully handled data with ML Number=${data['ML Number']}`)
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }

  stream.end();
}

start_upload_data_to_tellus();