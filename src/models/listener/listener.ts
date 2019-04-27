import { SecureSocket } from '../secure-socket';
import { ListenerOptions } from './listener-options';
import { Logger } from '../../logger';

const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory({
  points: 8,
  duration: 10
});

export abstract class Listener {
  public secureSocket: SecureSocket;
  public options: ListenerOptions;

  public constructor(secureSocket: SecureSocket, options: ListenerOptions) {
    this.secureSocket = secureSocket;
    this.options = options;
  }

  public initialize(): void {
    this.secureSocket.getSocket().on(this.options.event, (payload, ack) => {
      if (this.options.encrypted) {
        payload = this.secureSocket.decryptData(payload);
      }

      if (this.options.limit) {
        rateLimiter.consume(this.secureSocket.getSocketId(), 1).then(() => {
          if (this.options.tokenProtected) {
            this.tokenExecute(payload, ack);
          } else {
            this.execute(payload, ack);
          }
        }).catch(() => {
          Logger.error(`Socket ${this.secureSocket.getId()} reached limit`);
          this.secureSocket.returnEncrypted(
            500,
            {
              message: 'error.rate-limit'
            },
            ack
          );
        });
      }
    });
  }

  public abstract execute(payload: any, ack: Function): void;

  private tokenExecute(payload: any, ack: Function): void {

  }
}