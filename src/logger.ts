import * as winston from 'winston';
import { Logger as WinstonLogger } from 'winston';
import moment from 'moment';
import 'moment-timezone';

const {combine, timestamp, label, printf} = winston.format;
const loggerFormat = printf(info => {
  const timestamp = moment().tz('CET').format('DD/MM/YYYY, HH:mm:ss');
  return `(${timestamp}) [${info.label}] ${info.level}: ${info.message}`;
});

const logger: WinstonLogger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: 'Server' }),
    timestamp(),
    loggerFormat
  ),
  transports: [
    new winston.transports.Console({ format: loggerFormat })
  ]
});

export class Logger {
  public static enableProd(): void {
    logger.add(new winston.transports.File({filename: './logs/error.log', level: 'error'}));
    logger.add(new winston.transports.File({filename: './logs/combined.log'}));
  }

  public static info(message: string): void {
    logger.info(message);
  }

  public static error(message: string): void {
    logger.error(message);
  }
}