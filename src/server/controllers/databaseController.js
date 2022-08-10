const Inventory = require('../models/Inventory');

const databaseController = {};

databaseController.updateInventory = (req, res, next) => {
  Inventory.create({ items: res.locals.items });
  next();

};

module.exports = databaseController;


