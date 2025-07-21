import mongoose from 'mongoose';
import Product from './models/product.js';

const run = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/your-db-name'); // 🔁 Replace with your DB name

    const defaultUserId = '64b7f1e2c9e4a2a1b8d12345'; // 🔁 Replace with a real user ID from your users collection

    const result = await Product.updateMany(
      { user: { $exists: false } },
      { $set: { user: defaultUserId } }
    );

    console.log(`✅ Patched ${result.modifiedCount} products missing user field.`);
  } catch (error) {
    console.error('❌ Error patching products:', error);
  } finally {
    mongoose.connection.close();
  }
};

run();
