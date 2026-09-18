import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env';
import connectDB from './config/db';
import { defaultLimiter } from './middleware/rateLimiter';

import authRoutes from './modules/auth/auth.routes';
import patientRoutes from './modules/patients/patients.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' })); // lock this down to your app's scheme in production
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(defaultLimiter);

app.get('/health', (req: Request, res: Response) => res.json({ status: 'ok' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
// TODO as you build them out: /logs, /hospitals, /links, /appointments, /chat, /media, /admin

// Central error handler — never leak stack traces to the client.
app.use((err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: env.nodeEnv === 'development' ? err.message : 'Internal server error',
  });
});

connectDB()
  .then(() => {
    app.listen(env.port, '0.0.0.0', () =>
      console.log(`PREGO backend running on http://0.0.0.0:${env.port}`),
    );
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
