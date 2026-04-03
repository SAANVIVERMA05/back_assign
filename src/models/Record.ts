import mongoose, { Schema, Document } from 'mongoose';

export interface IRecord extends Document {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: Date;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RecordSchema: Schema = new Schema(
  {
    amount: { type: Number, required: true, min: [0.01, 'Amount must be greater than 0'] },
    type: { type: String, required: true, enum: ['INCOME', 'EXPENSE'] },
    category: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Record || mongoose.model<IRecord>('Record', RecordSchema);
