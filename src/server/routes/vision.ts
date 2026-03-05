import { Router } from 'express';
import { identifyImage } from '../controllers/visionController';

const router = Router();

// POST /api/vision/identify
// Body: { imageBase64: string }   (JPEG, already compressed by the frontend)
router.post('/identify', identifyImage);

export default router;
