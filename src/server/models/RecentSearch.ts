/**
 * RecentSearch Model – Mongoose schema for agent search history
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IRecentSearch extends Document {
  agentId?: string;
  query: string;
  destination: string;
  dates: string;
  travelers: string;
  parsedIntent?: any;
  resultsCount?: number;
  createdAt: Date;
}

const RecentSearchSchema = new Schema<IRecentSearch>(
  {
    agentId:      { type: String, index: true },
    query:        { type: String, required: true },
    destination:  { type: String, required: true },
    dates:        { type: String },
    travelers:    { type: String },
    parsedIntent: { type: Schema.Types.Mixed },
    resultsCount: { type: Number },
  },
  { timestamps: true }
);

// Auto-expire searches after 30 days
RecentSearchSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model<IRecentSearch>('RecentSearch', RecentSearchSchema);
