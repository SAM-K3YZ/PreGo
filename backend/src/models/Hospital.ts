import { Schema, model, Document, Types } from 'mongoose';

export interface IHospital extends Document {
  _id: Types.ObjectId;
  name: string;
  address?: string;
  contactEmail?: string;
  apiKeyHash: string;
}

const hospitalSchema = new Schema<IHospital>(
  {
    name: { type: String, required: true },
    address: String,
    contactEmail: String,
    // Hashed — the raw API key is shown to the hospital admin exactly once on creation.
    apiKeyHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

export default model<IHospital>('Hospital', hospitalSchema);
