import { Schema, model, Document, Types } from 'mongoose';

export interface IWeightLog extends Document {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  weightKg: number;
  loggedAt: Date;
}

const weightLogSchema = new Schema<IWeightLog>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true, index: true },
    weightKg: { type: Number, required: true },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<IWeightLog>('WeightLog', weightLogSchema);
