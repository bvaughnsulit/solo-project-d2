const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemHash: String,
  patternHash: String, 
  name: String,
  icon: String,
  watermark: String,
  image: String,
  type: String,
  damageType: String,
});

module.exports = mongoose.model('item', itemSchema);