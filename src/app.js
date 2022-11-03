import express from 'express';
import middlewares from './middlewares/middlewares.js';
import routes from './routes/routes.js';

// inicialization
const app = express();

// middlewares
app.use(middlewares);

// routes
app.use('/api', routes);

export default app;