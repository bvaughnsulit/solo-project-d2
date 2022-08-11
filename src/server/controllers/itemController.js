const Item = require('../models/Item');
const d2ApiController = require('./d2ApiController');

const itemController = {};

itemController.fillItemDetails = async (req, res, next) => {
  res.locals.itemsDetailed = [];
  res.locals.newItems = [];
  const dbPromises = res.locals.inventoryItemsIds.map(e => {
    const promise = Item.find({ itemHash: e.itemHash }).exec();
    promise.then(data => {
      if (data.length === 0) res.locals.newItems.push(e.itemHash);
      res.locals.itemsDetailed.push({
        itemInstanceId: e.itemInstanceId,
        ...data
      });
    });
    return promise;
  });
  await Promise.all(dbPromises);


  // let items = ids.map(e => {
  //   return d2ApiController.getItemDetails(e.itemHash);
  // });
  // items = await Promise.all(items);
  // items.forEach(e => {
  //   Item.create(e);
  // });
  next();
};

itemController.addItem = (req, res, next) => {
};

module.exports = itemController;
