const Joi = require('joi');

const itemSchema = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required()
});

const createPurchase = Joi.object({
  items: Joi.array().items(itemSchema).min(1).required(),
  address: Joi.string().required()
});

module.exports = { createPurchase };
