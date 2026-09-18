import { Schema, model, Document, Types } from 'mongoose';

export interface IPatientProfile extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  fullName: string;
  dob?: Date;
  bloodType?: string;
  conceptionDate?: Date;
  emergencyContactEncrypted?: string;
}

const patientProfileSchema = new Schema<IPatientProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    dob: Date,
    bloodType: String,
    conceptionDate: Date,
    // Encrypted at the application layer before save (see utils/fieldEncryption.ts).
    emergencyContactEncrypted: String,
  },
  { timestamps: true }
);

export default model<IPatientProfile>('PatientProfile', patientProfileSchema);
