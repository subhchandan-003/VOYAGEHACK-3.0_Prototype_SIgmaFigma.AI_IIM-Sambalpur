/**
 * Package Controller – Search, filter, and CRUD for travel packages
 */
import { Request, Response } from 'express';
import Package from '../models/Package';

// GET /api/packages
export const getPackages = async (req: Request, res: Response) => {
  try {
    const {
      destination,
      minPrice,
      maxPrice,
      sortBy = 'confidence',
      limit = 20,
      page = 1,
    } = req.query;

    let filter: any = { isActive: true };
    if (destination) filter.destination = new RegExp(String(destination), 'i');
    if (minPrice || maxPrice) {
      filter.totalPrice = {};
      if (minPrice) filter.totalPrice.$gte = Number(minPrice);
      if (maxPrice) filter.totalPrice.$lte = Number(maxPrice);
    }

    let sort: any = { confidenceScore: -1 };
    if (sortBy === 'price-low') sort = { totalPrice: 1 };
    if (sortBy === 'price-high') sort = { totalPrice: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [packages, total] = await Promise.all([
      Package.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Package.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: packages,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/packages/:id
export const getPackageById = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/packages/search – AI-powered search (simplified)
export const searchPackages = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ success: false, message: 'Query is required' });

    // Simple intent parsing (in production, use an NLP/LLM service)
    const lower = query.toLowerCase();
    let filter: any = { isActive: true };

    // Destination extraction
    const destinations = ['goa', 'dubai', 'maldives', 'bali', 'manali', 'singapore', 'jaipur', 'thailand', 'paris', 'kerala', 'santorini', 'switzerland', 'tokyo'];
    const matched = destinations.find(d => lower.includes(d));
    if (matched) filter.destination = new RegExp(matched, 'i');

    // Budget extraction
    const budgetMatch = lower.match(/(?:budget|₹|rs\.?|inr)\s*(\d[\d,.]*)\s*(k|l|lakh|lac)?/i);
    if (budgetMatch) {
      let amount = parseFloat(budgetMatch[1].replace(/,/g, ''));
      if (budgetMatch[2]?.startsWith('l')) amount *= 100000;
      else if (budgetMatch[2] === 'k') amount *= 1000;
      filter.totalPrice = { $lte: amount };
    }

    const packages = await Package.find(filter).sort({ confidenceScore: -1 }).limit(10);
    res.json({ success: true, data: packages, query, parsedFilter: filter });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/packages
export const createPackage = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, data: pkg });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/packages/:id
export const updatePackage = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/packages/:id
export const deletePackage = async (req: Request, res: Response) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, message: 'Package deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
