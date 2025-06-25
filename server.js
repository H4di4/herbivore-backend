require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const cartRoutes = require('./routes/cartRoutes');
const productsRouter = require('./routes/productRoutes');
const upload  = require('./config/multer.js');
const path = require('path');
const authRoutes = require('./routes/auth');
const bannerRoutes = require('./routes/banner');
const socialRoutes = require('./routes/SocialRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const settingRoutes = require('./routes/settingsRoutes.js')
const orderRoutes = require('./routes/orderRoutes.js')





const blogRoutes = require('./routes/blogRoutes.js');



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const connectDB = require('./config/db');
app.use(cors({
 
}));

connectDB()
app.use(express.json());

app.use('/api/cart', cartRoutes);

app.use('/api/products', productsRouter);

app.use('/api/auth', authRoutes);

app.use('/api/banner', bannerRoutes);

app.use('/api/social-links', socialRoutes);

app.use('/api/user', userRoutes);

app.use('/api/settings', settingRoutes);


app.use('/api/admin', blogRoutes);

app.use('/api/orders', orderRoutes);




app.get('/', (req,res) => {
    res.send('Server running on port 5000')
})

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});



app.listen(5000, () => console.log('Server running on port 5000'));
