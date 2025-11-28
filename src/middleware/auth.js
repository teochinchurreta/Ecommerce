const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('./logger');
const secret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.id).select('-password');
    if(!user) return res.status(401).json({ message: 'Usuario no encontrado' });
    req.user = user;
    next();
  } catch (err) {
    logger.error(err);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = auth;
