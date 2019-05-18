import { Listener, ListenerOptions, Crypto, ServerSecureSocket } from '../../models';

export class HandshakeListener extends Listener {
  public getOptions = (): ListenerOptions => ({
    event: 'handshake',
    limit: true
  });

  protected execute(secureSocket: ServerSecureSocket, payload: any, ack: Function): void {
    secureSocket.partnerPublicKey = new Crypto.RSA.PublicKey(payload.publicKey);
    ack({
      publicKey: secureSocket.keypair.publicKey.toString()
    });
  }
}