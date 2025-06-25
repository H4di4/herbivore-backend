
const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
 title: { type: String, required: true },
slug: { type: String, unique: true, required: true },
content: { type: String, required: true },
excerpt: String,  
author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   headerImage : { type: String },
  publishedAt: Date,
  tags: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', BlogPostSchema);
