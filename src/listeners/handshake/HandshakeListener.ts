import { Listener, ListenerOptions, Crypto } from '../../models';

export class HandshakeListener extends Listener {
  public getOptions = (): ListenerOptions => ({
    event: 'handshake',
    limit: true
  });

  protected execute(payload: any, ack: Function): void {
    this.secureSocket.clientPublicKey = new Crypto.RSA.PublicKey(payload.publicKey);
    ack({
      publicKey: this.secureSocket.keypair.publicKey.toString()
    });
  }
}