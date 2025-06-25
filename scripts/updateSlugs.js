const mongoose = require('mongoose');
const slugify = require('slugify');
const Product = require('../models/Product'); 

async function updateSlugs() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce-cart', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const productsWithoutSlug = await Product.find({
      $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }],
    });
    console.log(`Found ${productsWithoutSlug.length} products without slug.`);

    for (const product of productsWithoutSlug) {
      try {
        product.slug = slugify(product.name, { lower: true, strict: true });
        await product.save();
        console.log(`Updated slug for product: ${product.name} -> ${product.slug}`);
      } catch (err) {
        console.error(`Failed to update slug for product ${product.name}:`, err);
      }
    }

    console.log('Slug update complete.');
  } catch (err) {
    console.error('Error during updateSlugs:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateSlugs();
