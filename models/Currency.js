const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  symbol: { type: String, required: true },
  country: { type: String, required: true },
  currency: { type: String, required: true },
});

module.exports = mongoose.model('Currency', CurrencySchema);
