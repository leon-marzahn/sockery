import * as SocketIO from 'socket.io';
import { Crypto } from './crypto';
import { PacketData } from './packet-data';

export class SecureSocket {
  private customId: string = '';

  private socket: SocketIO.Socket;
  private keypair: Crypto.Keypair;
  private aesKey: string;

  private clientPublicKey: Crypto.PublicKey;

  public constructor(socket: SocketIO.Socket) {
    this.socket = socket;
  }

  public initialize(): void {
    this.keypair = Crypto.generateKeyPair();
    this.aesKey = Crypto.generateAesKey(128);
  }

  // Getters and Setters ///////////////////////////////////////////////////////////////////////////////////////////////

  public getId(): string {
    return (this.customId && this.customId.length > 0) ? this.customId : this.getSocketId();
  }

  public setId(customId: string): void {
    this.customId = customId;
  }

  public getSocketId(): string {
    return this.socket.id;
  }

  // Crypto Functions //////////////////////////////////////////////////////////////////////////////////////////////////

  public encrypt(payload: string): PacketData {
    const encryptedAesKey = this.keypair.privateKey.encrypt(this.aesKey);
    return {
      aes: encryptedAesKey,
      data: Crypto.encryptAes(payload, this.aesKey)
    } as PacketData;
  }

  public encryptData(payload: any): PacketData {
    const stringData = JSON.stringify(payload);
    return this.encrypt(stringData);
  }

  public decrypt(payload: PacketData): string {
    const decryptedAesKey = this.clientPublicKey.decrypt(payload.aes);
    return Crypto.decryptAes(payload.data, decryptedAesKey);
  }

  public decryptData(payload: PacketData): any {
    const stringData = this.decrypt(payload);
    return JSON.parse(stringData);
  }
}