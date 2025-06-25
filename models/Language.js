const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  country: { type: String, required: true },
});

module.exports = mongoose.model('Language', LanguageSchema);
