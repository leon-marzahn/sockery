import { Listener, ListenerOptions, Crypto, SecureSocket } from '../../models';

export class HandshakeListener extends Listener {
  public getOptions = (): ListenerOptions => ({
    event: 'handshake',
    limit: true
  });

  protected execute(secureSocket: SecureSocket, payload: any, ack: Function): void {
    secureSocket.clientPublicKey = new Crypto.RSA.PublicKey(payload.publicKey);
    ack({
      publicKey: secureSocket.keypair.publicKey.toString()
    });
  }
}