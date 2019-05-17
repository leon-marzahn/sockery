import { Logger as WinstonLogger } from 'winston';
import { Logger, logger as winstonLogger } from './logger';

describe('Logger', () => {
  let logger: WinstonLogger;

  beforeEach(() => {
    logger = winstonLogger;
  });

  it('should enable prod', () => {
    spyOn(logger, 'add').and.stub();

    Logger.enableProd();

    expect(logger.add).toHaveBeenCalledTimes(2);
  });

  it('should log an info message', () => {
    spyOn(winstonLogger, 'info').and.stub();

    Logger.info('test');

    expect(winstonLogger.info).toHaveBeenCalledWith('test');
  });

  it('should log an error message', () => {
    spyOn(winstonLogger, 'error').and.stub();

    Logger.error('test');

    expect(winstonLogger.error).toHaveBeenCalledWith('test');
  });
});