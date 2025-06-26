import pino from 'pino';

// Configure the logger with development-friendly formatting in dev mode
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    : undefined,
  // Remove sensitive data from logs
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.body.password',
      'req.body.token',
      'req.body.refreshToken',
      'req.body.cardNumber',
      'req.body.cvv',
      'res.body.token',
      'res.body.refreshToken'
    ],
    censor: '[REDACTED]'
  }
}); 