// models/SocialLinks.js
const mongoose = require('mongoose');

const SocialLinksSchema = new mongoose.Schema({
  instagram: { type: String, default: '' },
  facebook : { type: String, default: '' },
  youtube : { type: String, default: '' },
  twitter: { type: String, default: '' },
  

  
});

const SocialLinks = mongoose.model('SocialLinks', SocialLinksSchema);

module.exports = SocialLinks;
