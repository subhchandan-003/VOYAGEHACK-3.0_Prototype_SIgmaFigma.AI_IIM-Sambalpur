/**
 * Search Controller – Recent search history management
 */
import { Request, Response } from 'express';
import RecentSearch from '../models/RecentSearch';

// GET /api/searches/recent
export const getRecentSearches = async (req: Request, res: Response) => {
  try {
    const { agentId, limit = 10 } = req.query;
    let filter: any = {};
    if (agentId) filter.agentId = agentId;

    const searches = await RecentSearch.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, data: searches });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/searches
export const createSearch = async (req: Request, res: Response) => {
  try {
    const search = await RecentSearch.create(req.body);
    res.status(201).json({ success: true, data: search });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/searches/:id
export const deleteSearch = async (req: Request, res: Response) => {
  try {
    await RecentSearch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Search deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/searches/clear
export const clearSearches = async (req: Request, res: Response) => {
  try {
    const { agentId } = req.body;
    const filter: any = {};
    if (agentId) filter.agentId = agentId;
    await RecentSearch.deleteMany(filter);
    res.json({ success: true, message: 'Search history cleared' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
