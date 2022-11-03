
import { Router } from 'express';
import ctrl from './controllers.js';

const router = Router();

// routes
router.get('/', ctrl.getValue);
router.get('/local', ctrl.getLocalValue);

export default router;