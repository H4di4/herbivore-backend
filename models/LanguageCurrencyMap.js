const mongoose = require('mongoose');

const LanguageCurrencyMapSchema = new mongoose.Schema({
  languageCode: { type: String, required: true, unique: true },
  currencyCode: { type: String, required: true },
});

module.exports = mongoose.model('LanguageCurrencyMap', LanguageCurrencyMapSchema);
