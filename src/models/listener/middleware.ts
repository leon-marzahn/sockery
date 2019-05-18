import { ServerSecureSocket } from '../server-secure-socket';

export enum MiddlewareType {
  BEFORE_RATE_LIMIT,
  BEFORE_TOKEN,
  BEFORE_EXECUTE
}

export interface Middleware {
  type: MiddlewareType;

  /**
   * It is important that this function should execute the ack, IF the middleware forbids to proceed
   * This may change in the future, but now this is the best solution
   *
   * @param secureSocket: ServerSecureSocket
   * @param payload: any
   * @param ack: Function
   */
  execute(secureSocket: ServerSecureSocket, payload: any, ack: Function): boolean;
}