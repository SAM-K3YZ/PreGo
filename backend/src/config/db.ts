import mongoose from 'mongoose';
import env from './env';

export default async function connectDB(): Promise<void> {
  mongoose.set('strictQuery', true); // reject queries on undefined schema fields
  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected');
}
