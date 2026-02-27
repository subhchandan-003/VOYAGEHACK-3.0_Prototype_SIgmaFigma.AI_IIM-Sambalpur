/**
 * Trip Model – Mongoose schema for booked trips
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface ITrip extends Document {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  destination: string;
  dates: string;
  status: 'confirmed' | 'pending' | 'in-progress' | 'cancelled';
  packageId: mongoose.Types.ObjectId;
  packageSnapshot: any; // Stores a frozen copy of the package at booking time
  pnr: string;
  travelers?: any[];
  specialRequests?: string;
  addOns?: any[];
  totalPaid?: number;
  balanceDue?: number;
  paymentStatus?: 'full' | 'partial' | 'pending';
  alerts: { type: string; message: string; timestamp: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    clientName:      { type: String, required: true, index: true },
    clientEmail:     { type: String },
    clientPhone:     { type: String },
    destination:     { type: String, required: true },
    dates:           { type: String, required: true },
    status:          { type: String, enum: ['confirmed', 'pending', 'in-progress', 'cancelled'], default: 'pending' },
    packageId:       { type: Schema.Types.ObjectId, ref: 'Package' },
    packageSnapshot: { type: Schema.Types.Mixed },
    pnr:             { type: String, required: true, unique: true },
    travelers:       [Schema.Types.Mixed],
    specialRequests: { type: String },
    addOns:          [Schema.Types.Mixed],
    totalPaid:       { type: Number, default: 0 },
    balanceDue:      { type: Number, default: 0 },
    paymentStatus:   { type: String, enum: ['full', 'partial', 'pending'], default: 'pending' },
    alerts: [{
      type:      { type: String },
      message:   { type: String },
      timestamp: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

TripSchema.index({ status: 1 });
TripSchema.index({ pnr: 1 });
TripSchema.index({ destination: 1 });

export default mongoose.model<ITrip>('Trip', TripSchema);
