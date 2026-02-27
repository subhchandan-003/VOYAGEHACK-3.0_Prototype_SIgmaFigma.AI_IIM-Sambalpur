import { Router } from 'express';
import {
  getPackages,
  getPackageById,
  searchPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController';

const router = Router();

router.get('/', getPackages);
router.get('/:id', getPackageById);
router.post('/search', searchPackages);
router.post('/', createPackage);
router.put('/:id', updatePackage);
router.delete('/:id', deletePackage);

export default router;
