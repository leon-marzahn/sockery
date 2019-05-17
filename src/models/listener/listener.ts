import { SecureSocket } from '../secure-socket';
import { ListenerOptions } from './listener-options';
import { Logger } from '../../logger';
import * as JWT from 'jsonwebtoken';
import { MiddlewareManager } from './middleware-manager';
import { MiddlewareType } from './middleware';

const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory({
  points: 8,
  duration: 10
});

const secretKey: string = 'VerySecretKeyLmao';

export abstract class Listener {
  public abstract getOptions(): ListenerOptions;

  public initializeSocket(secureSocket: SecureSocket): void {
    secureSocket.getSocket().on(this.getOptions().event, (payload: any, ack: Function) => {
      if (this.getOptions().encrypted) {
        payload = secureSocket.decryptData(payload);
      }

      if (this.getOptions().limit) {
        if (this.executeMiddlewareManager(secureSocket, MiddlewareType.BEFORE_RATE_LIMIT, payload, ack)) {
          this.consumeRateLimit(secureSocket, payload, ack)
        }
      } else {
        this.consume(secureSocket, payload, ack);
      }
    });
  }

  private consume(secureSocket: SecureSocket, payload: any, ack: Function): void {
    if (this.getOptions().tokenProtected) {
      this.tokenExecute(secureSocket, payload, ack);
    } else {
      if (this.executeMiddlewareManager(secureSocket, MiddlewareType.BEFORE_EXECUTE, payload, ack)) {
        this.execute(secureSocket, payload, ack);
      }
    }
  }

  private consumeRateLimit(secureSocket: SecureSocket, payload: any, ack: Function): void {
    rateLimiter.consume(secureSocket.getSocketId(), 1).then(() => {
      this.consume(secureSocket, payload, ack);
    }).catch(() => {
      Logger.error(`Socket ${secureSocket.getId()} reached limit`);
      secureSocket.returnEncrypted(
        500,
        {
          error: 'rate-limit'
        },
        ack
      );
    });
  }

  protected abstract execute(secureSocket: SecureSocket, payload: any, ack: Function): void;

  private tokenExecute(secureSocket: SecureSocket, payload: any, ack: Function): void {
    if (this.executeMiddlewareManager(secureSocket, MiddlewareType.BEFORE_TOKEN, payload, ack)) {
      JWT.verify(payload.token, secretKey, (err: any, decoded: any) => {
        if (!err) {
          secureSocket.returnEncrypted(
            401,
            {
              error: 'invalid-token'
            },
            ack
          );
        } else {
          if (this.executeMiddlewareManager(secureSocket, MiddlewareType.BEFORE_EXECUTE, payload, ack)) {
            this.execute(secureSocket, payload, ack);
          }
        }
      });
    }
  }

  private executeMiddlewareManager(
    secureSocket: SecureSocket,
    type: MiddlewareType,
    payload: any,
    ack: Function
  ): boolean {
    return MiddlewareManager.execute(
      this.getOptions().middleware || [],
      type,
      secureSocket,
      payload,
      ack
    );
  }
}