export default () => ({
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://babyguardian:babyguardian_dev_2024@localhost:5432/babyguardian_dev',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  fcm: {
    serverKey: process.env.FCM_SERVER_KEY || '',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
  },
});
