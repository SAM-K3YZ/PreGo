import { Schema, model, Document, Types } from 'mongoose';

export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'platform_admin';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  mfaEnabled: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true, select: false }, // never returned by default
    role: {
      type: String,
      enum: ['patient', 'doctor', 'hospital_admin', 'platform_admin'],
      required: true,
    },
    mfaEnabled: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);
