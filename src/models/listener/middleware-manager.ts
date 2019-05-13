import { Middleware, MiddlewareType } from './middleware';
import { filter } from 'lodash';
import { SecureSocket } from '../secure-socket';

export class MiddlewareManager {
  public static execute(
    middleware: Middleware[],
    type: MiddlewareType,
    secureSocket: SecureSocket,
    payload: any, ack: Function
  ): boolean {
    filter(middleware, middleware => middleware.type === type).forEach(middlware => {
      if (!middlware.execute(secureSocket, payload, ack)) {
        return false;
      }
    });

    return true;
  }
}