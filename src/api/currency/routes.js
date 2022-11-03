
import { Router } from 'express';
import ctrl from './controllers.js';

const router = Router();

// routes
router.get('/', ctrl.getValue);

export default router;