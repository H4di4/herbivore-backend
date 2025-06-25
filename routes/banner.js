// routes/banner.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const upload = require('../config/multer');


const bannerFile = path.join(__dirname, '../data/banner.json');

// GET /api/banner
router.get('/', (req, res) => {
  fs.readFile(bannerFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading banner JSON:', err);
      return res.status(500).json({ error: 'Failed to read banner data' });
    }
    try {
      const banner = JSON.parse(data);
      res.json(banner);
    } catch (parseErr) {
      console.error('Error parsing banner JSON:', parseErr);
      res.status(500).json({ error: 'Failed to parse banner data' });
    }
  });
});


router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`; 

 res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });

});

// PUT /api/banner
router.put('/', (req, res) => {
  const newBanner = req.body;

  fs.writeFile(bannerFile, JSON.stringify(newBanner, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Failed to save banner' });
    res.json({ message: 'Banner updated successfully' });
  });
});

module.exports = router;
