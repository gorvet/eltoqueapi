import express from 'express';
import cors from 'cors';

// inicialization
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

export default app;