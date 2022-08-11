const express = require('express');
const router = express.Router();

const d2ApiController = require('../controllers/d2ApiController');
const itemController = require('../controllers/itemController');

router.get('/',
  d2ApiController.getInventory,
  itemController.fillItemDetails,
  d2ApiController.getNewItemDetails,
  itemController.saveNewItems,
  (req, res) => {
    return res.status(200).json(res.locals.itemsDetailed);
  }
);

module.exports = router; 