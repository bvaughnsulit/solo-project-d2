const Inventory = require('../models/Inventory');
const fetch = require('node-fetch');

/*
** clean this stuff up later!!
*/
const baseUrl = 'https://www.bungie.net/Platform/Destiny2/';
const membershipTypeId = '2';
const membershipId = process.env.MEMBERSHIP_ID;
const apiKey = process.env.API_KEY;
const token = process.env.TOKEN;

const hashes = {
  shapedPlug: ['659359923','1922808508'],
  craftedDate: '3947811849',
  level: '3077315735',
  levelProgress: '2899837482',
  perkSocket: '3410521964',
};

const d2ApiController = {};

d2ApiController.getInventory = (req, res, next) => {
  const components = [102, 201, 205]
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
        res.locals.inventoryItemsIds.push({
          itemHash: e.itemHash,
          itemInstanceId: e.itemInstanceId
        });
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
      parseInventoryReponse(json.Response);
      return next();
    })
    .catch(err => next(err));
};


/*
** get item details that are specific to a given item instance
*/
d2ApiController.getInstanceDetails = (req, res, next) => {
  const components = [302, 309];
  const options = {
    headers: {
      'X-API-Key': apiKey,
      'Authorization': `Bearer ${token}`
    }
  };
  
  res.locals.items.forEach(e => {
    const url = `${baseUrl}${membershipTypeId}/Profile/${membershipId}/Item/${e.itemInstanceId}?components=${components.join(',')}`;
    
    fetch(url, options)
      .then(response => {
        if (response.ok) return response.json();
        else return next(response.status);
      })
      .then(json => {

        // probably should refactor this
        let craftingData; 
        let hashIndex = 0;
        while (!craftingData) {
          craftingData = json.Response.plugObjectives.data.objectivesPerPlug[hashes.shapedPlug[hashIndex]]
          hashIndex++;
        }

        if (craftingData) {
          for (const i of craftingData) {
            const hash = i.objectiveHash.toString();
            if (hash === hashes.level)
              e.level = i.progress;
            else if (hash === hashes.craftedDate)
              e.craftedDate = i.progress;
            else if (hash === hashes.levelProgress)
              e.levelProgress = i.progress;
          }
        }
      })
      .catch(err => next(err));
    
  });

  return next();

};


/*
** get item details that are not specific to a given item instance
** should this go here? it's not called by any endpoint directly...
*/
d2ApiController.getItemDetails = async (itemHash) => {
  const options = {
    headers: {
      'X-API-Key': apiKey
    }
  };
  const itemUrl = `${baseUrl}Manifest/DestinyInventoryItemDefinition/`;
  
  try {
    const itemResponse = await fetch(itemUrl + itemHash, options);
    const itemJson = await itemResponse.json();
    const patternHash = itemJson.Response.inventory.recipeItemHash;
    const patternResponse = await fetch(itemUrl + patternHash, options);
    const patternJson = await patternResponse.json();

    // const sockets = patternJson.Response.sockets;

    // const { socketIndexes } = sockets.socketCategories.find(e => String(e.socketCategoryHash) === hashes.perkSocket);

    // const socketData = [];
    // socketIndexes.forEach(async (e, i) => {
    //   const plugSetHash = sockets.socketEntries[i].reusablePlugSetHash;
    //   const plugUrl = `${baseUrl}Manifest/DestinyPlugSetDefinition/`; 
    //   const plugResponse = await fetch(plugUrl + req.params.id, options);
    // });
        
    return {
      itemHash,
      patternHash,  
      name: itemJson.Response.displayProperties.name,
      icon: itemJson.Response.displayProperties.icon,
      watermark: itemJson.Response.iconWatermark,
      image: itemJson.Response.screenshot,
      type: itemJson.Response.itemTypeDisplayName,
      damageType: itemJson.Response.defaultDamageTypeHash,
      // sockets: socketData
    };
  }
  catch (err) {console.log(err);}
};



module.exports = d2ApiController;


