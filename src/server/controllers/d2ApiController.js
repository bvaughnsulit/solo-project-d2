const Inventory = require('../models/Inventory');
const fetch = require('node-fetch');

/*
** clean this stuff up later!!
*/
const baseUrl = 'https://www.bungie.net/Platform/Destiny2/';
const membershipTypeId = '2';
const membershipId = process.env.MEMBERSHIP_ID;
const components = [102, 201, 205]
const url = `${baseUrl}${membershipTypeId}/Profile/${membershipId}/?components=${components.join(',')}`;
const apiKey = process.env.API_KEY;
const token = process.env.TOKEN;


const d2ApiController = {};

d2ApiController.getInventory = (req, res, next) => {
  res.locals.items = [];
  
  /*
  ** helper function to take relevant fields from API response and
  ** map to res.locals
  */
  const extractCraftedItemFields = (array) => {
    array.forEach(e => { 
      // if item is crafted or crafted+masterworked
      if (e.state === 8 || e.state === 9) {
        res.locals.items.push({
          itemHash: e.itemHash,
          itemInstanceId: e.itemInstanceId
        });
      }
    });
  };
  
  const options = {
    headers: {
      'X-API-Key': apiKey,
      'Authorization': `Bearer ${token}`
    }
  };

  fetch(url, options)
    .then(response => response.json())
    .then(json => {
      // items in vault
      extractCraftedItemFields(json.Response.profileInventory.data.items);
      
      // equipped items
      const equippedItems = json.Response.characterEquipment.data;
      for (const char in equippedItems) {
        // equipped items
        extractCraftedItemFields(equippedItems[char].items);

        // items stored on characters
        extractCraftedItemFields(json.Response.characterInventories.data[char].items);
      }

      next();
    }).catch(err => console.log(err));
};

module.exports = d2ApiController;


