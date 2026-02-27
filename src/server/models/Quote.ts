/**
 * Quote Model – Mongoose schema for client quotes
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IQuote extends Document {
  quoteNumber: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  packageId: mongoose.Types.ObjectId;
  packageSnapshot: any;
  destination: string;
  dates: string;
  travelers: string;
  totalPrice: number;
  markup: number;
  finalPrice: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    quoteNumber:     { type: String, required: true, unique: true },
    clientName:      { type: String, required: true },
    clientEmail:     { type: String },
    clientPhone:     { type: String },
    packageId:       { type: Schema.Types.ObjectId, ref: 'Package' },
    packageSnapshot: { type: Schema.Types.Mixed },
    destination:     { type: String, required: true },
    dates:           { type: String },
    travelers:       { type: String },
    totalPrice:      { type: Number, required: true },
    markup:          { type: Number, default: 0 },
    finalPrice:      { type: Number, required: true },
    status:          { type: String, enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'], default: 'draft' },
    validUntil:      { type: Date, required: true },
    notes:           { type: String },
  },
  { timestamps: true }
);

QuoteSchema.index({ quoteNumber: 1 });
QuoteSchema.index({ status: 1 });
QuoteSchema.index({ clientName: 1 });

export default mongoose.model<IQuote>('Quote', QuoteSchema);
