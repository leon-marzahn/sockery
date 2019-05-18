import { SecureSocket } from './secure-socket';
import * as SocketIO from 'socket.io';

export class ServerSecureSocket extends SecureSocket {
  private customId: string = '';

  protected socket: SocketIO.Socket;

  constructor(socket: SocketIO.Socket) {
    super(socket);
  }

  // Getters and Setters ///////////////////////////////////////////////////////////////////////////////////////////////

  public getId(): string {
    return (this.customId && this.customId.length > 0) ? this.customId : this.getSocketId();
  }

  public setId(customId: string): void {
    this.customId = customId;
  }

  public getSocket(): SocketIO.Socket {
    return this.socket;
  }

  // Ack Functions /////////////////////////////////////////////////////////////////////////////////////////////////////

  public returnUnencrypted(code: number, payload: any, ack: Function): void {
    ack({
      code,
      payload
    });
  }

  public returnEncrypted(code: number, payload: any, ack: Function): void {
    ack(this.encryptPayload({
      code,
      payload
    }));
  }
}