import express from 'express';

// routes
import currencyRoutes from '../api/currency/routes.js';
// valores en local
import currencyLocal from '../api/currency/local.js';

// inicialization
const app = express();

// routes
app.use('/currency', currencyLocal);

export default app;