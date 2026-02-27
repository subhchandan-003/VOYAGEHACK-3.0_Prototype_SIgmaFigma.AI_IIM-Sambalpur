import { Router } from 'express';
import {
  getRecentSearches,
  createSearch,
  deleteSearch,
  clearSearches,
} from '../controllers/searchController';

const router = Router();

router.get('/recent', getRecentSearches);
router.post('/', createSearch);
router.delete('/clear', clearSearches);
router.delete('/:id', deleteSearch);

export default router;
