import { Middleware, MiddlewareType } from './middleware';
import { filter } from 'lodash';
import { ServerSecureSocket } from '../server-secure-socket';

export class MiddlewareManager {
  public static execute(
    middleware: Middleware[],
    type: MiddlewareType,
    secureSocket: ServerSecureSocket,
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