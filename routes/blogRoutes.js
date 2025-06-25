const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const authMiddleware = require('../middleware/auth');
const slugify = require('slugify');
const upload = require('../config/multer');

async function generateUniqueSlug(title) {
  let slug = slugify(title, { lower: true });
  let slugExists = await BlogPost.findOne({ slug });
  let suffix = 1;

  while (slugExists) {
    slug = slugify(title, { lower: true }) + '-' + suffix;
    slugExists = await BlogPost.findOne({ slug });
    suffix++;
  }

  return slug;
}



router.post(
  '/blogs',
  authMiddleware,
  upload.fields([
    { name: 'headerImage', maxCount: 1 },
    { name: 'contentImages', maxCount: 5 } // Optional for future content image uploads
  ]),
  async (req, res) => {
    try {
      const post = new BlogPost(req.body);
      post.slug = await generateUniqueSlug(post.title);

      // Handle header image
      if (req.files?.headerImage?.length) {
        post.headerImage = `/uploads/${req.files.headerImage[0].filename}`;
      }

      // If needed later
      if (req.files?.contentImages?.length) {
        post.contentImages = req.files.contentImages.map(f => `/uploads/${f.filename}`);
      }

      await post.save();
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);




router.get('/blogs', async (req, res) => {
  const posts = await BlogPost.find().sort({ publishedAt: -1 });
  res.json(posts);
});


router.get('/blogs/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).send('Blog post not found');
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


router.delete('/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const deletedBlog = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});



router.put('/blogs/:id', authMiddleware, async (req, res) => {
  try {
    const updatedBlog = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBlog);
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ error: "Failed to update blog" });
  }
});


router.get('/blogs/id/:id', async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).send('Blog not found');
    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



module.exports = router