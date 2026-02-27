/**
 * Destination Model – Mongoose schema for trending destinations
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  country: string;
  tagline: string;
  startingPrice: number;
  image: string;
  color: string;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
  bestTime: string;
  flightTime: string;
  categories: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
  {
    name:          { type: String, required: true, unique: true, index: true },
    country:       { type: String, required: true },
    tagline:       { type: String, required: true },
    startingPrice: { type: Number, required: true },
    image:         { type: String, required: true },
    color:         { type: String, required: true },
    rating:        { type: Number, required: true, min: 0, max: 5 },
    reviews:       { type: Number, default: 0 },
    badge:         { type: String },
    badgeColor:    { type: String },
    bestTime:      { type: String, required: true },
    flightTime:    { type: String, required: true },
    categories:    [{ type: String, enum: ['india', 'international', 'beach', 'mountain', 'heritage'] }],
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

DestinationSchema.index({ categories: 1 });
DestinationSchema.index({ startingPrice: 1 });
DestinationSchema.index({ rating: -1 });

export default mongoose.model<IDestination>('Destination', DestinationSchema);
