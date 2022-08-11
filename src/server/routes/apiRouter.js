const express = require('express');
const router = express.Router();

const d2ApiController = require('../controllers/d2ApiController');
const inventoryController = require('../controllers/inventoryController');
const itemController = require('../controllers/itemController');

router.get('/',
  d2ApiController.getInventory,
  itemController.fillItemDetails,
  d2ApiController.getItemDetails,
  // d2ApiController.getInstanceDetails,
  // inventoryController.updateInventory,
  (req, res) => {
    return res.status(200).json(res.locals.itemsDetailed);
  }
);

router.get('/itemDetails/:id',
  d2ApiController.getItemDetails,
  (req, res) => {
    return res.status(200).json(res.locals.itemDetails);
  }
);

module.exports = router; 