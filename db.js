import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // 👈 đọc biến từ file .env

const PORT = process.env.PORT || 3000;

const connectDb = (app) => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecom';
  console.log('🔗 Mongo URI:', mongoUri);

  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ Failed to connect to MongoDB:', err);
    });
};

export { connectDb };
