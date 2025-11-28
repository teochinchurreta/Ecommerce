const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtPurchase: { type: Number, required: true, min: 0 }
});

const purchaseSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [purchaseItemSchema], required: true },
  total: { type: Number, required: true, min: 0 },
  purchaseDate: { type: Date, default: Date.now },
  address: { type: String, required: true },
  status: { type: String, enum: ['pending','completed','cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Purchase', purchaseSchema);
