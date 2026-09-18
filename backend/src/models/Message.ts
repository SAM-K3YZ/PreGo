import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  _id: Types.ObjectId;
  linkId: Types.ObjectId;
  senderId: Types.ObjectId;
  bodyEncrypted: string;
  sentAt: Date;
  readAt?: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    linkId: { type: Schema.Types.ObjectId, ref: 'PatientHospitalLink', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bodyEncrypted: { type: String, required: true }, // encrypted via utils/fieldEncryption.ts before save
    sentAt: { type: Date, default: Date.now },
    readAt: Date,
  },
  { timestamps: true }
);

export default model<IMessage>('Message', messageSchema);
