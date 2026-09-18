import { Schema, model, Document, Types } from 'mongoose';

export type LinkStatus = 'pending' | 'active' | 'revoked';

// Opaque routing record (Notion Phase 3) — the ONLY bridge between a patient
// and a hospital/doctor. Never stores the hospital's internal patient/EMR ID.
// linkToken is what chat/appointments reference, so a breach of this
// collection reveals a routing relationship, never a hospital medical record.
export interface IPatientHospitalLink extends Document {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  hospitalId: Types.ObjectId;
  doctorId: Types.ObjectId;
  linkToken: string;
  status: LinkStatus;
  linkedAt?: Date;
}

const patientHospitalLinkSchema = new Schema<IPatientHospitalLink>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    linkToken: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'active', 'revoked'], default: 'pending' },
    linkedAt: Date,
  },
  { timestamps: true }
);

export default model<IPatientHospitalLink>('PatientHospitalLink', patientHospitalLinkSchema);
