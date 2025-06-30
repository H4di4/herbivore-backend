const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');


router.post('/', async (req, res) => {
  const { title, price, image, quantity = 1 } = req.body;

  try {
    const newItem = new CartItem({ title, price, image, quantity });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error(' Failed to add item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});


router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await CartItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) return res.status(400).json({ error: 'Quantity must be at least 1' });

    const updatedItem = await CartItem.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// DELETE /api/cart/clear
router.delete('/clear', async (req, res) => {
  try {
    await CartItem.deleteMany({});
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
     console.error('Error clearing cart:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});


module.exports = router;
