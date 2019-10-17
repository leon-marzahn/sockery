import { Crypto } from '../crypto';
import { Socket as ServerSocket } from 'socket.io';
import { PacketPayload } from '../packet-payload';

type AbstractSocket = ServerSocket | SocketIOClient.Socket;

export abstract class SecureSocketV2 {
  public keypair: Crypto.RSA.Keypair;
  public aesKey: string;
  public peerPublicKey: Crypto.RSA.PublicKey;

  protected readonly socket: AbstractSocket;

  protected constructor(socket: AbstractSocket) {
    this.socket = socket;
  }

  /**
   * Initialize SecureSocket by generating a keypair and an AES key
   */
  public initialize(): void {
    this.keypair = Crypto.RSA.generateKeypair();
    this.aesKey = Crypto.AES.generateKey(128);
  }

  // === Getters and Setters === //

  public getSocket(): AbstractSocket {
    return this.socket;
  }

  public getSocketId(): string {
    return this.socket.id;
  }

  // === Cryptography === //

  public encrypt(payload: string): PacketPayload {
    return {
      aes: this.peerPublicKey.encrypt(this.aesKey, this.keypair.privateKey),
      payload: Crypto.AES.encrypt(payload, this.aesKey)
    }
  }

  public encryptJSON(payload: any): PacketPayload {
    return this.encrypt(JSON.stringify(payload));
  }

  public decrypt(packetPayload: PacketPayload): string {
    return Crypto.AES.decrypt(
      packetPayload.payload,
      this.keypair.privateKey.decrypt(packetPayload.aes, this.peerPublicKey)
    );
  }

  public decryptJSON(packetPayload: PacketPayload): any {
    return JSON.parse(this.decrypt(packetPayload));
  }
}
