const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

// GET /api/orders/all - fetch all orders (admin)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    // Optional: check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




// POST /api/orders/place
router.post('/place', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items to place an order.' });
    }

    const order = new Order({
      user: req.user.id,
      items,
      totalAmount,
      status: 'pending'
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
