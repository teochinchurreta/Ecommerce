const Joi = require('joi');

const createProduct = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).default(0)
});

const updateProduct = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow(''),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0)
});

module.exports = { createProduct, updateProduct };
