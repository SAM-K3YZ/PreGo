import { Schema, model, Document, Types } from 'mongoose';

// Append-only by convention: no route in this codebase should ever expose an
// update or delete for AuditLog. Enforce that in code review, not just here.
export interface IAuditLog extends Document {
  _id: Types.ObjectId;
  actorId: Types.ObjectId;
  action: string; // e.g. "symptom_log.create", "patient.view"
  targetCollection?: string;
  targetId?: Types.ObjectId;
  ipAddress?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetCollection: String,
    targetId: Schema.Types.ObjectId,
    ipAddress: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export default model<IAuditLog>('AuditLog', auditLogSchema);
