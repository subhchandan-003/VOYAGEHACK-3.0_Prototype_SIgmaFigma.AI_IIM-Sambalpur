/**
 * Quote Controller – CRUD for client quotes
 */
import { Request, Response } from 'express';
import Quote from '../models/Quote';

// GET /api/quotes
export const getQuotes = async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    let filter: any = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [quotes, total] = await Promise.all([
      Quote.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Quote.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: quotes,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/quotes/:id
export const getQuoteById = async (req: Request, res: Response) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.json({ success: true, data: quote });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/quotes
export const createQuote = async (req: Request, res: Response) => {
  try {
    const quoteNumber = 'Q-' + Date.now().toString(36).toUpperCase();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7); // Valid for 7 days

    const quote = await Quote.create({ ...req.body, quoteNumber, validUntil });
    res.status(201).json({ success: true, data: quote });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/quotes/:id
export const updateQuote = async (req: Request, res: Response) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.json({ success: true, data: quote });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /api/quotes/:id/status
export const updateQuoteStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['draft', 'sent', 'accepted', 'rejected', 'expired'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const quote = await Quote.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.json({ success: true, data: quote });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/quotes/:id
export const deleteQuote = async (req: Request, res: Response) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
    res.json({ success: true, message: 'Quote deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
