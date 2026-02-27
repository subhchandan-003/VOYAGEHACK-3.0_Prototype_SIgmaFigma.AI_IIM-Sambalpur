/**
 * MongoDB Connection Configuration
 * ================================
 * Uses Mongoose to connect to MongoDB Atlas or a local MongoDB instance.
 *
 * Environment Variables Required:
 *   MONGO_URI  – MongoDB connection string (e.g. mongodb+srv://user:pass@cluster.mongodb.net/tbo_travel)
 *
 * Usage: import connectDB from './config/db'; await connectDB();
 */
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tbo_travel';
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
