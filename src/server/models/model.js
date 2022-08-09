const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
  foo: String
});

module.exports = mongoose.model('thing', newSchema);