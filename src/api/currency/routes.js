
import { Router } from 'express';
import ctrl from './controllers.js';

const router = Router();

setInterval( ctrl.getValue, 60000);//probando cada 60s
 

// routes   
//router.get('/a', ctrl.getValue);


router.get('/', ctrl.getLocalValue);

export default router;