import { SecureSocket } from './secure-socket';
import { Crypto } from './crypto';
import { isUndefined } from 'lodash';

export class ClientSecureSocket extends SecureSocket {
  protected socket: SocketIOClient.Socket;

  constructor(socket: SocketIOClient.Socket) {
    super(socket);
  }

  public initialize(): void {
    super.initialize();

    this.socket.on('connect', () => {
      this.emitUnencrypted('handshake', {
        publicKey: this.keypair.publicKey.toString()
      }, (payload: { publicKey: string }) => {
        this.partnerPublicKey = new Crypto.RSA.PublicKey(payload.publicKey);
      });
    });
  }

  public getSocket(): SocketIOClient.Socket {
    return this.socket;
  }

  public on(event: string, listener: Function): SocketIOClient.Emitter {
    return this.socket.on(event, listener);
  }

  public emitUnencrypted(event: string, payload?: any, ack?: Function): SocketIOClient.Socket {
    if (!isUndefined(payload)) {
      return this.socket.emit(event, payload, ack);
    } else {
      return this.socket.emit(event, ack);
    }
  }

  public emitEncrypted(event: string, payload?: any, ack?: Function): SocketIOClient.Socket {
    if (!isUndefined(payload)) {
      return this.socket.emit(event, this.encryptPayload(payload), ack);
    } else {
      return this.socket.emit(event, ack);
    }
  }
}