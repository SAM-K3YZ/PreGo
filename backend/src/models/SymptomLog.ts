import { Schema, model, Document, Types } from 'mongoose';

export interface ISymptomLog extends Document {
  _id: Types.ObjectId;
  patientId: Types.ObjectId;
  symptomType: string;
  severity?: number;
  note?: string;
  loggedAt: Date;
}

const symptomLogSchema = new Schema<ISymptomLog>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'PatientProfile', required: true, index: true },
    symptomType: { type: String, required: true },
    severity: { type: Number, min: 1, max: 5 },
    note: String,
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model<ISymptomLog>('SymptomLog', symptomLogSchema);
