import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';
import { errorHandler } from './middlewares/errorMiddleware';

const app = express();

app.use(helmet());
app.use(cors({ origin: true })); // tune origin for production
app.use(express.json({ limit: '10kb' }));

app.use('/api', router);

// health
app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;