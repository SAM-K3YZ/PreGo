import { Schema, model, Document, Types } from 'mongoose';

export interface IMediaFile extends Document {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  s3Key: string;
  category: 'ultrasound' | 'belly_photo' | 'prescription';
  uploadedAt: Date;
}

const mediaFileSchema = new Schema<IMediaFile>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true, index: true },
    s3Key: { type: String, required: true }, // never a public URL — resolved via signed URL at read time
    category: { type: String, enum: ['ultrasound', 'belly_photo', 'prescription'], required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<IMediaFile>('MediaFile', mediaFileSchema);
