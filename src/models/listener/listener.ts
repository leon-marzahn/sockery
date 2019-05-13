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
  public secureSocket: SecureSocket;

  public abstract getOptions(): ListenerOptions;

  public constructor(secureSocket: SecureSocket) {
    this.secureSocket = secureSocket;
  }

  public initialize(): void {
    this.secureSocket.getSocket().on(this.getOptions().event, (payload: any, ack: Function) => {
      if (this.getOptions().encrypted) {
        payload = this.secureSocket.decryptData(payload);
      }

      if (this.getOptions().limit) {
        if (this.executeMiddlewareManager(MiddlewareType.BEFORE_RATE_LIMIT, payload, ack)) {
          this.consumeRateLimit(payload, ack)
        }
      } else {
        this.consume(payload, ack);
      }
    });
  }

  private consume(payload: any, ack: Function): void {
    if (this.getOptions().tokenProtected) {
      this.tokenExecute(payload, ack);
    } else {
      if (this.executeMiddlewareManager(MiddlewareType.BEFORE_EXECUTE, payload, ack)) {
        this.execute(payload, ack);
      }
    }
  }

  private consumeRateLimit(payload: any, ack: Function): void {
    rateLimiter.consume(this.secureSocket.getSocketId(), 1).then(() => {
      this.consume(payload, ack);
    }).catch(() => {
      Logger.error(`Socket ${this.secureSocket.getId()} reached limit`);
      this.secureSocket.returnEncrypted(
        500,
        {
          error: 'rate-limit'
        },
        ack
      );
    });
  }

  protected abstract execute(payload: any, ack: Function): void;

  private tokenExecute(payload: any, ack: Function): void {
    if (this.executeMiddlewareManager(MiddlewareType.BEFORE_TOKEN, payload, ack)) {
      JWT.verify(payload.token, secretKey, (err: any, decoded: any) => {
        if (!err) {
          this.secureSocket.returnEncrypted(
            401,
            {
              error: 'invalid-token'
            },
            ack
          );
        } else {
          if (this.executeMiddlewareManager(MiddlewareType.BEFORE_EXECUTE, payload, ack)) {
            this.execute(payload, ack);
          }
        }
      });
    }
  }

  private executeMiddlewareManager(type: MiddlewareType, payload: any, ack: Function): boolean {
    return MiddlewareManager.execute(
      this.getOptions().middleware || [],
      type,
      this.secureSocket,
      payload,
      ack
    );
  }
}