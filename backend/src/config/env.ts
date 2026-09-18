import 'dotenv/config';

const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'REDIS_URL'] as const;

// Fail fast: never let the server boot silently with a missing secret —
// that's how you end up running production with a default/dev JWT secret.
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}. Check .env against .env.example`);
  }
}

interface EnvConfig {
  port: number;
  mongoUri: string;
  redisUrl: string;
  jwt: {
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
  s3: {
    bucket?: string;
    region?: string;
  };
  nodeEnv: 'development' | 'production' | 'test';
}

const env: EnvConfig = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI as string,
  redisUrl: process.env.REDIS_URL as string,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET as string,
    refreshSecret: process.env.JWT_REFRESH_SECRET as string,
    accessExpiresIn: '15m',
    refreshExpiresIn: '30d',
  },
  s3: {
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
  },
  nodeEnv: (process.env.NODE_ENV as EnvConfig['nodeEnv']) || 'development',
};

export default env;
