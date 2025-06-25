const express = require('express');
const router = express.Router();
const Product = require('../models/Product.js');
const slugify = require('slugify');

const categoryMap = {
  serums: 'Serums',
  oils: 'Oils',
  cleansers: 'Cleansers',
  'eye-creams': 'Eye Creams',
  moisturizers: 'Moisturizers',
  'lip-care': 'Lip',
  scrubs: 'Scrubs',
  'body-moisturizers': 'Body Moisturizers',
  soaps: 'Soaps',
  'bath-body': 'Bath + Body',
  'fine-lines': 'Fine Lines',
  dullness: 'Dullness',
  dryness: 'Dryness',
  acne: 'Acne',
  redness: 'Redness',
  new: 'New',
  sets: 'Sets',
  all: 'All',
};

// 1. Specific routes first

// Get bestsellers
router.get('/bestsellers', async (req, res) => {
  try {
    const bestsellers = await Product.find({ isBestSeller: true });
    res.json(bestsellers);
  } catch (error) {
    console.error('Failed to fetch bestseller products:', error);
    res.status(500).json({ message: 'Failed to fetch bestseller products' });
  }
});

// Search products
router.get('/search', async (req, res) => {
  const { keyword, category, skinConcerns, bestseller } = req.query;
  let filter = {};

  if (keyword) {
    filter.name = { $regex: keyword, $options: 'i' };
  }

  if (category) {
    filter.category = category;
  }

  if (skinConcerns) {
    const concernsArray = Array.isArray(skinConcerns)
      ? skinConcerns
      : skinConcerns.split(',');
    filter['filters.skinConcerns'] = { $in: concernsArray };
  }

  if (bestseller === 'true') {
    filter.isBestSeller = true;
  }

  try {
    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get related products
router.get('/related/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json(related);
  } catch (error) {
    console.error('Error fetching related products:', error);
    res.status(500).json({ message: 'Error fetching related products' });
  }
});

// Get product by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error retrieving product by slug:', err);
    res.status(500).json({ message: 'Error retrieving product', error: err.message });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  const slug = req.params.category.toLowerCase();
  const category = categoryMap[slug];
  if (!category) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (err) {
    console.error('Failed to fetch products by category:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 2. More general param routes after specific ones

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error retrieving product by ID:', err);
    res.status(500).json({ message: 'Error retrieving product', error: err.message });
  }
});

// 3. Create, list all, delete routes

// Create new product (with slug generation if missing)
router.post('/', async (req, res) => {
  try {
    const productData = req.body;

    // Generate slug if missing but name is provided
    if (!productData.slug && productData.name) {
      productData.slug = slugify(productData.name, { lower: true, strict: true });
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: err.message });
  }
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
