const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
items: [
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: String,
    price: Number,
    quantity: Number,
    imageUrl: String 
  }
]
,
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // or 'completed'
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
