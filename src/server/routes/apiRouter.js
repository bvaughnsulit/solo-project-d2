const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');
const d2ApiController = require('../controllers/d2ApiController');
const databaseController = require('../controllers/databaseController');

router.get('/',
  d2ApiController.getInventory,
  databaseController.updateInventory,
  (req, res) => {
    return res.status(200).json(res.locals.data);
  }
);

module.exports = router;  


