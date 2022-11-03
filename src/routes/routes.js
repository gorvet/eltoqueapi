import express from 'express';

// routes
import currencyRoutes from '../api/currency/routes.js';

// inicialization
const app = express();

// routes
app.use('/currency', currencyRoutes);

export default app;