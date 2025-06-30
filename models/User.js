const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },

  bio: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
}, { 
  timestamps: true,
  toJSON: { virtuals: true },   
  toObject: { virtuals: true }
});

// ✅ Virtual field to determine if the user is an admin
userSchema.virtual('isAdmin').get(function () {
  return this.role === 'admin';
});

module.exports = mongoose.model("User", userSchema);
