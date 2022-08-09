const Model = require('../models/model.js');

const apiController = {};

apiController.someMethod = (req, res, next) => {
  next();
};

module.exports = apiController;