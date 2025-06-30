const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');
const Order = require('../models/Order');

// GET /api/orders/all - Admin: fetch all orders
router.get('/all', adminAuthMiddleware, async (req, res) => {
  try {
    if (!req.user.admin) {
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


// GET /api/orders/my - Get logged-in user's orders
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(userOrders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/orders/place - Place a new order
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

// GET /api/orders/:id - Get order by ID
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  console.log('GET order id:', id);

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);  // 👈 Should log detailed info
    res.status(500).json({ message: 'Server error' });
  }
});
// PATCH /api/orders/:id/status - Admin only, update order status
router.patch('/:id/status', adminAuthMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate order ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid order ID' });
  }

  // Validate status input (optional: check if status is allowed)
  const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!status || !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status
    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
