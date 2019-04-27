import * as SocketIO from 'socket.io';
import { Crypto } from './crypto';
import { PacketData } from './packet-data';

export class SecureSocket {
  private customId: string = '';

  private socket: SocketIO.Socket;
  private keypair: Crypto.RSA.Keypair;
  private aesKey: string;

  private clientPublicKey: Crypto.RSA.PublicKey;

  public constructor(socket: SocketIO.Socket) {
    this.socket = socket;
  }

  public initialize(): void {
    this.keypair = Crypto.RSA.generateKeyPair();
    this.aesKey = Crypto.AES.generateKey(128);
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

  public getSocketId(): string {
    return this.socket.id;
  }

  // Crypto Functions //////////////////////////////////////////////////////////////////////////////////////////////////

  public encrypt(payload: string): PacketData {
    const encryptedAesKey = this.clientPublicKey.encrypt(this.aesKey, this.keypair.privateKey);
    return {
      aes: encryptedAesKey,
      data: Crypto.AES.encrypt(payload, this.aesKey)
    } as PacketData;
  }

  public encryptData(payload: any): PacketData {
    const stringData = JSON.stringify(payload);
    return this.encrypt(stringData);
  }

  public decrypt(payload: PacketData): string {
    const decryptedAesKey = this.keypair.privateKey.decrypt(payload.aes);
    return Crypto.AES.decrypt(payload.data, decryptedAesKey);
  }

  public decryptData(payload: PacketData): any {
    const stringData = this.decrypt(payload);
    return JSON.parse(stringData);
  }

  // Ack Functions /////////////////////////////////////////////////////////////////////////////////////////////////////

  public returnUnencrypted(code: number, payload: any, ack: Function): void {
    ack({
      code,
      payload
    });
  }

  public returnEncrypted(code: number, payload: any, ack: Function): void {
    ack(this.encryptData({
      code,
      payload
    }));
  }
}