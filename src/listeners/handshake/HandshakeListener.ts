import { Listener, ListenerOptions } from '../../models';

export class HandshakeListener extends Listener {
  public getOptions = (): ListenerOptions => ({
    event: 'handshake'
  });

  protected execute(payload: any, ack: Function): void {
  }
}