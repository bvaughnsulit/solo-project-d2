const Inventory = require('../models/Inventory');
const fetch = require('node-fetch');

/*
** clean this stuff up later!!
*/
const urlRoot = 'https://www.bungie.net';
const baseUrl = urlRoot + '/Platform/Destiny2/';
const membershipTypeId = '2';
const membershipId = process.env.MEMBERSHIP_ID;
const apiKey = process.env.API_KEY;
const token = process.env.TOKEN;

const hashes = {
  shapedPlug: ['659359923','1922808508','4029346515'],
  craftedDate: '3947811849',
  level: '3077315735',
  levelProgress: ['2899837482','325548827'],
  perkSocket: '3410521964',
};

const d2ApiController = {};


/*
** gets a users inventory from API, and adds each item to inventoryItemsIds
** as an array of objects containing itemHash and itemInstanceId.
*/
d2ApiController.getInventory = (req, res, next) => {
  console.log('called get inventory...');
  const components = [102, 201, 205];
  const url = `${baseUrl}${membershipTypeId}/Profile/${membershipId}/?components=${components.join(',')}`;

  res.locals.inventoryItemsIds = [];
  
  /*
  ** helper function to take relevant fields from API response and
  ** map to res.locals
  */
  const extractCraftedItemFields = (array) => {
    array.forEach(e => { 
      // if item is crafted or crafted+masterworked
      if (e.state === 8 || e.state === 9) {
        // a hacky solution for the fact that the recurrent impact pattern
        // has a state of "crafted" for some reason!!
        if (e.bucketHash !== 766235248) {
          res.locals.inventoryItemsIds.push({
            itemHash: e.itemHash,
            itemInstanceId: e.itemInstanceId
          });
        }
      }
    });
  };

  /*
  ** helper function to grab the various properties from the response
  ** that include inventories
  */
  const parseInventoryReponse = (Response) => {
    // items in vault
    extractCraftedItemFields(Response.profileInventory.data.items);

    // equipped items
    const equippedItems = Response.characterEquipment.data;
    for (const char in equippedItems) {
      // equipped items
      extractCraftedItemFields(equippedItems[char].items);

      // items stored on characters
      extractCraftedItemFields(Response.characterInventories.data[char].items);
    }
  };

  if (req.query.mockInventoryResponse) {
    const { Response } = require('../mocks/inventory.json');
    parseInventoryReponse(Response);
    return next();
  };

  const options = {
    headers: {
      'X-API-Key': apiKey,
      'Authorization': `Bearer ${token}`
    }
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) return response.json();
      else return next(response.status);
    })
    .then(json => {
      console.log('handling inventory API response...');
      parseInventoryReponse(json.Response);
      return next();
    })
    .catch(err => next(err));
};


/*
** iterates through itemHashes in newItems, querying api for each.
** results are added to each object element in newItems array 
*/
d2ApiController.getNewItemDetails = async (req, res, next) => {
  if (res.locals.newItems.length === 0) return next();
  console.log('getting new item details...');
  let counter = 0;
  const promise = new Promise((resolve, reject) => { 
    
    res.locals.newItems.forEach((e, i) => { 
      const options = {
        headers: {
          'X-API-Key': apiKey
        }
      };
      const itemUrl = `${baseUrl}Manifest/DestinyInventoryItemDefinition/`;
      
      fetch(itemUrl + e.itemHash, options)
        .then(itemResponse => itemResponse.json())
        .then(itemJson => {
          console.log('processing new item information...');
          e.name = itemJson.Response.displayProperties.name;
          e.icon = urlRoot + itemJson.Response.displayProperties.icon;
          e.watermark = urlRoot + itemJson.Response.iconWatermark;
          e.image = urlRoot + itemJson.Response.screenshot;
          e.type = itemJson.Response.itemTypeDisplayName;
          e.damageType = itemJson.Response.defaultDamageTypeHash;
          e.patternHash = itemJson.Response.inventory.recipeItemHash;
          
          fetch(itemUrl + e.patternHash, options)
            .then(patternResponse => patternResponse.json())
            .then(patternJson => {
              console.log('processing new pattern information...');
              const sockets = patternJson.Response.sockets;

              const { socketIndexes } = sockets.socketCategories.find(e => String(e.socketCategoryHash) === hashes.perkSocket);

              e.sockets = [];
              socketIndexes.forEach(async (elem, index) => {
                const {
                  socketTypeHash,
                  singleInitialItemHash,
                  reusablePlugItems,
                  reusablePlugSetHash
                } = sockets.socketEntries[elem];

                e.sockets[index] = {
                  socketTypeHash,
                  singleInitialItemHash,
                  reusablePlugItems,
                  reusablePlugSetHash
                };
              });        
              if (++counter >= res.locals.newItems.length) resolve();
            });
        })
        .catch(err => console.log(err));
      
    });

  });
  promise.then(() => {
    return next();
  });
};


/*
** gets instance details for one given instanceId, which is provided in url
*/
d2ApiController.getInstanceDetails = (req, res, next) => {
  console.log('called getInstanceDetails with ' + req.params.instanceId);
  if (req.params.instanceId === null) {
    return next({ message: 'instanceId is required' });
  }
  const instanceDetails = {itemInstanceId: req.params.instanceId};
  const components = [302, 309];
  const options = {
    headers: {
      'X-API-Key': apiKey,
      'Authorization': `Bearer ${token}`
    }
  };
  
  const url = `${baseUrl}${membershipTypeId}/Profile/${membershipId}/Item/${req.params.instanceId}?components=${components.join(',')}`;
  
  fetch(url, options)
    .then(response => {
      if (response.ok) return response.json();
      else return next(response.status);
    })
    .then(json => {
      instanceDetails.perks = [];
      json.Response.perks.data.perks.forEach((e, i) => {
        instanceDetails.perks[i] = String(e.perkHash);
      });
    
   
      const objectives = json.Response.plugObjectives.data.objectivesPerPlug;
      let craftingData;
      for (let i = 0; i < hashes.shapedPlug.length; i++){
        if (objectives[hashes.shapedPlug[i]]) {
          craftingData = objectives[hashes.shapedPlug[i]];
          break;
        }
      }
      
      if (craftingData !== undefined) {
        for (const i of craftingData) {
          const hash = i.objectiveHash.toString();
          if (hash === hashes.level)
            instanceDetails.level = i.progress;
          else if (hash === hashes.craftedDate)
            instanceDetails.craftedDate = i.progress;
          else if (hash === hashes.levelProgress[0]
            || hash === hashes.levelProgress[1])
            instanceDetails.levelProgress = i.progress;
        }
      }
      res.locals.instanceDetails = instanceDetails;
      return next();
    })
    .catch(err => next(err));
};


module.exports = d2ApiController;


