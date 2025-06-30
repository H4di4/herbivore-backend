const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const upload = require('../config/multer')

// GET /api/user/profile
router.get('/profile', authMiddleware, async (req, res) => {

  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('savedPosts', 'title'); // populate only title of saved posts

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      savedPosts: user.savedPosts,
      isAdmin: user.isAdmin, 
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});




// PUT /api/user/update
router.put(
  '/update',
  authMiddleware,
  upload.single('profilePicture'),
  async (req, res) => {
    try {
      const { firstName, lastName, bio } = req.body;
      const updatedFields = { firstName, lastName, bio };

      if (req.file) {
        updatedFields.profilePicture = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updatedFields },
        { new: true }
      ).select('-password');

      res.json({
        msg: 'Profile updated',
        user: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          bio: updatedUser.bio,
          profilePicture: updatedUser.profilePicture,
           isAdmin: updatedUser.isAdmin,
        },
      });
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ msg: 'Server error' });
    }
  }
);

// GET /api/user/all
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password') // Don't send passwords
      .lean(); // Returns plain JS objects

    res.json(users);
  } catch (err) {
    console.error('Error fetching all users:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});




module.exports = router;
