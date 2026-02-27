/**
 * Package Model – Mongoose schema for travel packages
 */
import mongoose, { Schema, Document } from 'mongoose';

const FlightSchema = new Schema({
  airline:        { type: String, required: true },
  flightNumber:   { type: String, required: true },
  departure:      { type: Schema.Types.Mixed, required: true },
  arrival:        { type: Schema.Types.Mixed, required: true },
  duration:       { type: String, required: true },
  stops:          { type: Number, default: 0 },
  class:          { type: String, default: 'Economy' },
  price:          { type: Number, required: true },
  baggage:        { type: String },
}, { _id: false });

const HotelSchema = new Schema({
  name:               { type: String, required: true },
  category:           { type: String, required: true },
  rating:             { type: Number },
  location:           { type: String },
  area:               { type: String },
  images:             [String],
  amenities:          [String],
  roomType:           { type: String },
  mealPlan:           { type: String },
  pricePerNight:      { type: Number, required: true },
  totalPrice:         { type: Number, required: true },
  nights:             { type: Number, required: true },
  cancellationPolicy: { type: String },
}, { _id: false });

const ActivitySchema = new Schema({
  name:        { type: String, required: true },
  type:        { type: String },
  duration:    { type: String },
  description: { type: String },
  included:    [String],
  price:       { type: Number, required: true },
  image:       { type: String },
}, { _id: false });

const TransferSchema = new Schema({
  type:    { type: String, required: true },
  vehicle: { type: String, required: true },
  from:    { type: String },
  to:      { type: String },
  price:   { type: Number, required: true },
}, { _id: false });

export interface IPackage extends Document {
  name: string;
  destination: string;
  confidenceScore: number;
  whyThisBundle: string;
  outboundFlight: any;
  returnFlight: any;
  hotel: any;
  activities: any[];
  transfers: any[];
  totalPrice: number;
  priceBreakdown: {
    flights: number;
    hotel: number;
    activities: number;
    transfers: number;
    taxes: number;
  };
  policies: {
    cancellation: string;
    amendment: string;
    payment: string;
  };
  badge?: string;
  badgeColor?: string;
  discount?: number;
  originalPrice?: number;
  travelers?: string;
  duration?: string;
  highlights?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name:            { type: String, required: true },
    destination:     { type: String, required: true, index: true },
    confidenceScore: { type: Number, required: true },
    whyThisBundle:   { type: String },
    outboundFlight:  FlightSchema,
    returnFlight:    FlightSchema,
    hotel:           HotelSchema,
    activities:      [ActivitySchema],
    transfers:       [TransferSchema],
    totalPrice:      { type: Number, required: true, index: true },
    priceBreakdown: {
      flights:    Number,
      hotel:      Number,
      activities: Number,
      transfers:  Number,
      taxes:      Number,
    },
    policies: {
      cancellation: String,
      amendment:    String,
      payment:      String,
    },
    badge:         { type: String },
    badgeColor:    { type: String },
    discount:      { type: Number },
    originalPrice: { type: Number },
    travelers:     { type: String },
    duration:      { type: String },
    highlights:    [String],
    isActive:      { type: Boolean, default: true },
  },
  { timestamps: true }
);

PackageSchema.index({ destination: 1, totalPrice: 1 });
PackageSchema.index({ confidenceScore: -1 });

export default mongoose.model<IPackage>('Package', PackageSchema);
