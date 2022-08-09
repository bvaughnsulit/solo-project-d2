const Model = require('../models/model.js');

const mainController = {};

mainController.someMethod = (req, res, next) => {
  Model.create({ foo: 'hello' });
  res.locals.info = 'yoyo';
  next();
};

module.exports = mainController;