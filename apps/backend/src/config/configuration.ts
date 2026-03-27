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
  camera: {
    /** Clave dedicada para AES (recomendado en producción); si falta, se deriva de JWT_SECRET */
    encryptionKey: process.env.CAMERA_ENCRYPTION_KEY || '',
  },
  ai: {
    groqApiKey: process.env.GROQ_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    defaultModelGroq: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
    defaultModelOpenai: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    defaultModelAnthropic: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022',
  },
});
