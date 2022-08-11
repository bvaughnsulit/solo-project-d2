const express = require('express');
const router = express.Router();

const d2ApiController = require('../controllers/d2ApiController');
const itemController = require('../controllers/itemController');

router.get('/inventory',
  d2ApiController.getInventory,
  itemController.fillItemDetails,
  d2ApiController.getNewItemDetails,
  itemController.saveNewItems,
  (req, res) => {
    return res.status(200).json(res.locals.itemsDetailed);
  }
);

router.get('/instanceDetails/:instanceId',
  d2ApiController.getInstanceDetails,
  (req, res) => {
    console.log('sending response...')
    return res.status(200).json(res.locals.instanceDetails);
  }
);


module.exports = router; 