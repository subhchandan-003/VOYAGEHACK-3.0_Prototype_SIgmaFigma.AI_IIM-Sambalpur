import { Router } from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  updateTripStatus,
  deleteTrip,
  getTripStats,
} from '../controllers/tripController';

const router = Router();

router.get('/stats', getTripStats);
router.get('/', getTrips);
router.get('/:id', getTripById);
router.post('/', createTrip);
router.put('/:id', updateTrip);
router.patch('/:id/status', updateTripStatus);
router.delete('/:id', deleteTrip);

export default router;
