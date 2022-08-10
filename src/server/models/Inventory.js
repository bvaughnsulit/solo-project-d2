const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemHash: Number,
  itemInstanceId: String
});

const inventorySchema = new mongoose.Schema({
  items: [itemSchema]
});

module.exports = mongoose.model('inventory', inventorySchema);