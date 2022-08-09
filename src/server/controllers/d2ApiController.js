//const Model = require('../models/model.js');
const fetch = require('node-fetch');


const baseUrl = 'https://www.bungie.net/Platform/Destiny2/';
const membershipTypeId = '2';
const membershipId = process.env.MEMBERSHIP_ID;
const characterId = process.env.CHAR_ID;
const url = `${baseUrl}${membershipTypeId}/Profile/${membershipId}/Character/${characterId}?components=205`;

const d2ApiController = {};

'/Destiny2/2/Profile/4611686018493588541/Character/2305843009526377295?components=205'

'/Destiny2/2/Profile/4611686018493588541/Character/2305843009716534316?components=205'


d2ApiController.getInventory = (req, res, next) => {
  fetch(url, { headers: { 'X-API-Key': process.env.API_KEY } })  
    .then(res => res.json())
    .then(json => {
      res.locals.data = json.Response.equipment.data.items;
      next();
    })
    .catch(err => console.log(err));
};

module.exports = d2ApiController;


