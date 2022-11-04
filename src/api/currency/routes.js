
import { Router } from 'express';
import ctrl from './controllers.js';

const router = Router();

ctrl.getValue()
    .then(setInterval(ctrl.getValue, 60000));

// routes   
router.get('/', ctrl.getLocalValue);

export default router;