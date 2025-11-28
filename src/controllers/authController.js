const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validators/authValidator');
const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn });
}

exports.register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const existing = await User.findOne({ email: value.email });
    if(existing) return res.status(400).json({ message: 'Email ya registrado' });

    const user = new User(value);
    await user.save();
    const token = generateToken(user);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const user = await User.findOne({ email: value.email });
    if(!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const match = await user.comparePassword(value.password);
    if(!match) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = generateToken(user);
    res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (err) {
    next(err);
  }
};
