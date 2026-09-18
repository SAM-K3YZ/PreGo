import { Schema, model, Document, Types } from 'mongoose';

export interface IDoctor extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  hospitalId: Types.ObjectId;
  specialty: string;
  consultationFee?: number;
  bio?: string;
  isVerified: boolean;
}

const doctorSchema = new Schema<IDoctor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    specialty: { type: String, required: true },
    consultationFee: Number,
    bio: String,
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IDoctor>('Doctor', doctorSchema);
