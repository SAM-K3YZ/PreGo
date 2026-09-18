import { Schema, model, Document, Types } from 'mongoose';

export interface IMedication extends Document {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  name: string;
  dosage?: string;
  schedule?: string; // e.g. "08:00,20:00"
  active: boolean;
}

const medicationSchema = new Schema<IMedication>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true, index: true },
    name: { type: String, required: true },
    dosage: String,
    schedule: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<IMedication>('Medication', medicationSchema);
