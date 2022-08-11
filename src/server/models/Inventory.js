const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  itemHash: Number,
  itemInstanceId: String
});

const inventorySchema = new mongoose.Schema({
  items: [inventoryItemSchema]
});

module.exports = mongoose.model('inventory', inventorySchema);