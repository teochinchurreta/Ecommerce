const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const { createPurchase } = require('../validators/purchaseValidator');
const { getPagination } = require('../utils/paginate');

exports.create = async (req, res, next) => {
  try {
    const { error, value } = createPurchase.validate(req.body);
    if(error) return res.status(400).json({ message: error.message });

    let total = 0;
    const items = [];
    for(const it of value.items){
      const product = await Product.findById(it.product);
      if(!product) return res.status(400).json({ message: `Producto no encontrado: ${it.product}` });
      if(product.stock < it.quantity) return res.status(400).json({ message: `Stock insuficiente para ${product.name}` });

      items.push({
        product: product._id,
        quantity: it.quantity,
        priceAtPurchase: product.price
      });
      total += product.price * it.quantity;
    }

    for(const it of value.items){
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
    }

    const purchase = new Purchase({
      buyer: req.user._id,
      items,
      total,
      address: value.address
    });
    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const query = {}; 
    const [items, total] = await Promise.all([
      Purchase.find(query).populate('buyer', 'name email').populate('items.product', 'name price').skip(skip).limit(limit).sort({ createdAt: -1 }),
      Purchase.countDocuments(query)
    ]);
    res.json({ meta: { page, limit, total }, items });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const purchase = await Purchase.findById(req.params.id).populate('buyer', 'name email').populate('items.product', 'name price');
    if(!purchase) return res.status(404).json({ message: 'Compra no encontrada' });
    if(purchase.buyer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }
    res.json(purchase);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const update = {};
    if(req.body.address) update.address = req.body.address;
    if(req.body.status && ['pending','completed','cancelled'].includes(req.body.status)) update.status = req.body.status;

    const purchase = await Purchase.findById(req.params.id);
    if(!purchase) return res.status(404).json({ message: 'Compra no encontrada' });
    if(purchase.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    Object.assign(purchase, update);
    await purchase.save();
    res.json(purchase);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if(!purchase) return res.status(404).json({ message: 'Compra no encontrada' });
    if(purchase.buyer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }

    for(const it of purchase.items){
      await Product.findByIdAndUpdate(it.product, { $inc: { stock: it.quantity } });
    }
    await purchase.remove();
    res.json({ message: 'Compra eliminada' });
  } catch (err) { next(err); }
};
