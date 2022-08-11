const Inventory = require('../models/Inventory');

const inventoryController = {};

inventoryController.updateInventory = (req, res, next) => {
  Inventory.create({ items: res.locals.items });
  next();
};

module.exports = inventoryController;

