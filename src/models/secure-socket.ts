import * as SocketIO from 'socket.io';
import { Crypto } from './crypto';
import { PacketPayload } from './packet-payload';

export abstract class SecureSocket {
  public keypair: Crypto.RSA.Keypair;
  public aesKey: string;
  public partnerPublicKey: Crypto.RSA.PublicKey;

  protected readonly socket: SocketIO.Socket | SocketIOClient.Socket;

  protected constructor(socket: SocketIO.Socket | SocketIOClient.Socket) {
    this.socket = socket;
  }

  public initialize(): void {
    this.keypair = Crypto.RSA.generateKeyPair();
    this.aesKey = Crypto.AES.generateKey(128);
  }

  // Getters and Setters ///////////////////////////////////////////////////////////////////////////////////////////////

  public getSocket(): SocketIO.Socket | SocketIOClient.Socket {
    return this.socket;
  }

  public getSocketId(): string {
    return this.socket.id;
  }

  // Crypto Functions //////////////////////////////////////////////////////////////////////////////////////////////////

  public encrypt(payload: string): PacketPayload {
    const encryptedAesKey = this.partnerPublicKey.encrypt(this.aesKey, this.keypair.privateKey);
    return {
      aes: encryptedAesKey,
      payload: Crypto.AES.encrypt(payload, this.aesKey)
    } as PacketPayload;
  }

  public encryptPayload(payload: any): PacketPayload {
    const stringPayload = JSON.stringify(payload);
    return this.encrypt(stringPayload);
  }

  public decrypt(payload: PacketPayload): string {
    const decryptedAesKey = this.keypair.privateKey.decrypt(payload.aes);
    return Crypto.AES.decrypt(payload.payload, decryptedAesKey);
  }

  public decryptPayload(payload: PacketPayload): any {
    const stringPayload = this.decrypt(payload);
    return JSON.parse(stringPayload);
  }
}