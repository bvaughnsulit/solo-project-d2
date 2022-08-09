const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');
const d2ApiController = require('../controllers/d2ApiController');

router.get('/',
  d2ApiController.getInventory,
  (req, res) => {
    return res.status(200).json(res.locals.data);
  }
);

module.exports = router;  