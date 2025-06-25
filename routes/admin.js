// routes/admin.js
const express = require('express');
const authMiddleware = require('../middlewear/auth');
const router = express.Router();

router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ msg: 'Welcome to the admin dashboard' });
});

module.exports = router;
