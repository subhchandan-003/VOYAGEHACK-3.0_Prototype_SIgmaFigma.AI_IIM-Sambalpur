/**
 * Trip Controller – CRUD for booked trips
 */
import { Request, Response } from 'express';
import Trip from '../models/Trip';

// GET /api/trips
export const getTrips = async (req: Request, res: Response) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    let filter: any = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [trips, total] = await Promise.all([
      Trip.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Trip.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: trips,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trips/:id
export const getTripById = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/trips
export const createTrip = async (req: Request, res: Response) => {
  try {
    // Generate PNR
    const pnr = 'TBO' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();
    const trip = await Trip.create({ ...req.body, pnr });
    res.status(201).json({ success: true, data: trip });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/trips/:id
export const updateTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PATCH /api/trips/:id/status
export const updateTripStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'pending', 'in-progress', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { alerts: { type: 'info', message: `Status changed to ${status}`, timestamp: new Date() } },
      },
      { new: true }
    );
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/trips/:id
export const deleteTrip = async (req: Request, res: Response) => {
  try {
    const trip = await Trip.findByIdAndDelete(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    res.json({ success: true, message: 'Trip deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/trips/stats
export const getTripStats = async (_req: Request, res: Response) => {
  try {
    const [total, confirmed, pending, inProgress] = await Promise.all([
      Trip.countDocuments(),
      Trip.countDocuments({ status: 'confirmed' }),
      Trip.countDocuments({ status: 'pending' }),
      Trip.countDocuments({ status: 'in-progress' }),
    ]);

    const revenueResult = await Trip.aggregate([
      { $match: { status: { $in: ['confirmed', 'in-progress'] } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPaid' } } },
    ]);

    res.json({
      success: true,
      data: {
        total,
        confirmed,
        pending,
        inProgress,
        totalRevenue: revenueResult[0]?.totalRevenue || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
