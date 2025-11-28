require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

async function seed() {
  await connectDB(process.env.MONGO_URI);
  await User.deleteMany();
  await Product.deleteMany();

  const admin = new User({ name: 'Admin', email: 'admin@example.com', password: 'password123', role: 'admin' });
  await admin.save();

  const user = new User({ name: 'User', email: 'user@example.com', password: 'password123' });
  await user.save();

  const p1 = new Product({ name: 'Camiseta', description: 'Algodón', price: 20, stock: 50, user: admin._id });
  const p2 = new Product({ name: 'Taza', description: 'Cerámica', price: 8.5, stock: 100, user: admin._id });
  await p1.save();
  await p2.save();

  console.log('Seed completo');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
