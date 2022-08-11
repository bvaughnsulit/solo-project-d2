const Item = require('../models/Item');
const d2ApiController = require('./d2ApiController');

const itemController = {};


/*
** iterates through itemHashes in inventoryItemsIds, searching through local
** db for each. if found, adds data to itemsDetailed object
** if not found, appends itemHash and instance id to newItems array
*/
itemController.fillItemDetails = async (req, res, next) => {
  res.locals.itemsDetailed = {};
  res.locals.newItems = [];
  const dbPromises = res.locals.inventoryItemsIds.map(e => {
    const promise = Item.findOne({ itemHash: e.itemHash }).exec();
    promise.then(data => {
      if (data === null) res.locals.newItems.push({
        itemHash: e.itemHash
      });
      else res.locals.itemsDetailed[e.itemInstanceId] = {
        itemInstanceId: e.itemInstanceId,
        ...data.toJSON()
      };
    });
    return promise;
  });
  await Promise.all(dbPromises);
  return next();
};


/*
** iterates through newItems, creates new DB document from each obj element
** and adds results to itemdetails object
*/
itemController.saveNewItems = async (req, res, next) => {
  if (res.locals.newItems.length === 0) return next();
  const dbPromises = res.locals.newItems.map(e => {
    // should be more specific in the item creation here, since this will add the item instance id to the db
    const promise = Item.create(e);
    promise.then(data => {
      res.locals.itemsDetailed[e.itemInstanceId] = {
        ...data.toJSON()
      };
    });
    return promise;
  });
  await Promise.all(dbPromises);
  return next();
};

module.exports = itemController;
