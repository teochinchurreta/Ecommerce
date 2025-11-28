const Product = require('../models/Product');
const { createProduct, updateProduct } = require('../validators/productValidator');
const { getPagination } = require('../utils/paginate');

exports.create = async (req, res, next) => {
  try {
    const { error, value } = createProduct.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const product = new Product({ ...value, user: req.user._id });
    await product.save();
    res.status(201).json(product);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const [items, total] = await Promise.all([
      Product.find().populate('user', 'name email').skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments()
    ]);
    res.json({ meta: { page, limit, total }, items });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', 'name email');
    if(!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { error, value } = updateProduct.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if(product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin'){
      return res.status(403).json({ message: 'No autorizado' });
    }

    Object.assign(product, value);
    await product.save();
    res.json(product);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if(product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin'){
      return res.status(403).json({ message: 'No autorizado' });
    }

    await product.remove();
    res.json({ message: 'Producto eliminado' });
  } catch (err) { next(err); }
};
