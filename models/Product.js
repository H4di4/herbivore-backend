const mongoose = require('mongoose');
const slugify = require('slugify');


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  price: {
    type: Number,
    required: true,
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
  },

  discountPrice: {
    type: Number,
    default: null,
  },

  
  onSale: {
    type: Boolean,
    default: false,
  },

  
  sizes: [{
    size: String,        
    price: Number,        
  }],

  description: {
    type: String,
    default: '',
  },

  howToUse: {
    type: String,
    default: '',
  },

  ingredients: {
    type: String,
    default: '',
  },

  imageUrl: {
    type: [String],
    default: '',
  },

  category: {
    type: String,
    enum: [
      'Serums', 'Oils', 'Cleansers', 'Eye Creams', 'Moisturizers', 'Lip',
      'Scrubs', 'Body Moisturizers', 'Soaps', 'Bath + Body', 'Fine Lines',
      'Dullness', 'Dryness', 'Acne', 'Redness', 'New', 'Sets', 'All'
    ],
    required: true,
  },

  filters: {
    age: { type: String, default: '' },
    skinTypes: { type: [String], default: [] },
    skinConcerns: { type: [String], default: [] },
  },

  isBestSeller: {
    type: Boolean,
    default: false,
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model('Product', productSchema);


