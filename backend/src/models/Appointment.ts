import { Schema, model, Document, Types } from 'mongoose';

export interface IAppointment extends Document {
  _id: Types.ObjectId;
  linkId: Types.ObjectId;
  type: 'checkup' | 'ultrasound' | 'consultation';
  scheduledAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    linkId: { type: Schema.Types.ObjectId, ref: 'PatientHospitalLink', required: true },
    type: { type: String, enum: ['checkup', 'ultrasound', 'consultation'], required: true },
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
    notes: String,
  },
  { timestamps: true }
);

export default model<IAppointment>('Appointment', appointmentSchema);
