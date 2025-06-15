import * as dotenv from 'dotenv';
import { createLogger, transports, format } from 'winston';

dotenv.config();

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [new transports.Console()],
  format: format.combine(format.timestamp(), format.json()),
});

if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET is not set in environment variables');
  throw new Error('JWT_SECRET is not set');
}

export const JWT_SECRET = process.env.JWT_SECRET;

logger.info('JWT_SECRET loaded successfully');