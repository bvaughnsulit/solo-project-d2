const Item = require('../models/Item');
const d2ApiController = require('./d2ApiController');

const itemController = {};

itemController.fillItemDetails = async (req, res, next) => {
  res.locals.itemsDetailed = [];
  res.locals.newItems = [];
  const dbPromises = res.locals.inventoryItemsIds.map(e => {
    const promise = Item.find({ itemHash: e.itemHash }).exec();
    promise.then(data => {
      if (data.length === 0) res.locals.newItems.push({
        itemHash: e.itemHash
      });
      res.locals.itemsDetailed.push({
        itemInstanceId: e.itemInstanceId,
        ...data
      });
    });
    return promise;
  });
  await Promise.all(dbPromises);
  return next();
};


itemController.saveNewItems = async (req, res, next) => {
  if (res.locals.newItems.length === 0) return next();
  const dbPromises = res.locals.newItems.map(e => {
    console.log(e)
    const promise = Item.create(e);
    promise.then(data => {
      res.locals.itemsDetailed.push({
        itemInstanceId: e.itemInstanceId,
        ...data
      });
    });
    return promise;
  });
  await Promise.all(dbPromises);
  return next();
};

module.exports = itemController;
