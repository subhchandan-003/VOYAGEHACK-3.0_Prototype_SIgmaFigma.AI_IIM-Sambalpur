/**
 * Destination Controller – CRUD + filtering for trending destinations
 */
import { Request, Response } from 'express';
import Destination from '../models/Destination';

// GET /api/destinations
export const getDestinations = async (req: Request, res: Response) => {
  try {
    const { category, sortBy, limit = 20 } = req.query;

    let filter: any = { isActive: true };
    if (category && category !== 'all') {
      filter.categories = category;
    }

    let sort: any = { rating: -1 };
    if (sortBy === 'price-low') sort = { startingPrice: 1 };
    if (sortBy === 'price-high') sort = { startingPrice: -1 };
    if (sortBy === 'reviews') sort = { reviews: -1 };

    const destinations = await Destination.find(filter)
      .sort(sort)
      .limit(Number(limit));

    res.json({ success: true, data: destinations, count: destinations.length });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/destinations/:id
export const getDestinationById = async (req: Request, res: Response) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, data: destination });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/destinations
export const createDestination = async (req: Request, res: Response) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/destinations/:id
export const updateDestination = async (req: Request, res: Response) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, data: destination });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/destinations/:id
export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, message: 'Destination deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
