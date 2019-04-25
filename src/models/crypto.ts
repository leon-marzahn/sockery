import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';
import * as aesjs from 'aes-js';

export namespace Crypto {
  /// RSA //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  export function newNonce () {
    return nacl.randomBytes(nacl.secretbox.nonceLength);
  }

  export class PublicKey {
    private readonly key: string;

    public constructor(key: string) {
      this.key = key;
    }

    public encrypt(data: string, privateKey: PrivateKey): string {
      const publicKeyBuffer = naclutil.decodeBase64(this.key);
      const privateKeyBuffer = naclutil.decodeBase64(privateKey.toString());

      const nonce = newNonce();
      const messageUint8 = naclutil.decodeUTF8(data);
      const box = nacl.box(messageUint8, nonce, publicKeyBuffer, privateKeyBuffer);

      const fullMessage = new Uint8Array(nonce.length + box.length);
      fullMessage.set(nonce);
      fullMessage.set(box, nonce.length);

      return naclutil.encodeBase64(fullMessage);
    }

    public toString(): string {
      return this.key;
    }
  }

  export class PrivateKey {
    private readonly key: string;

    public constructor(key: string) {
      this.key = key;
    }

    public decrypt(data: string, publicKey: PublicKey): string {
      const privateKeyBuffer = naclutil.decodeBase64(this.key);
      const publicKeyBuffer = naclutil.decodeBase64(publicKey.toString());

      const messageWithNonceAsUint8Array = naclutil.decodeBase64(data);
      const nonce = messageWithNonceAsUint8Array.slice(0, nacl.box.nonceLength);
      const message = messageWithNonceAsUint8Array.slice(
        nacl.box.nonceLength,
        data.length
      );

      const decrypted = nacl.box.open(message, nonce, publicKeyBuffer, privateKeyBuffer);

      if (!decrypted) {
        throw new Error("Could not decrypt message");
      }

      return naclutil.encodeUTF8(decrypted);
    }

    public toString(): string {
      return this.key;
    }
  }

  export class Keypair {
    public publicKey: PublicKey;
    public privateKey: PrivateKey;

    public constructor(publicKey: PublicKey, privateKey: PrivateKey) {
      this.publicKey = publicKey;
      this.privateKey = privateKey;
    }
  }

  export function generateKeyPair(): Keypair {
    const keypair = nacl.box.keyPair();
    const publicKey = naclutil.encodeBase64(keypair.publicKey);
    const privateKey = naclutil.encodeBase64(keypair.secretKey);

    return new Keypair(new PublicKey(publicKey), new PrivateKey(privateKey));
  }

  /// AES //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  export function generateAesKey(bits: number): string {
    const aesKey: number[] = [];

    for (let i = 0; i < (bits / 8); i++) {
      aesKey.push(Math.floor(Math.random() * Math.floor(256)));
    }

    const aesKeyBytes = new Uint8Array(aesKey);
    return aesjs.utils.hex.fromBytes(aesKeyBytes);
  }

  export function encryptAes(data: string, key: string): string {
    const dataBytes = aesjs.utils.utf8.toBytes(data);
    const keyBytes = aesjs.utils.hex.toBytes(key);
    const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes);
    const encryptedBytes = aesCtr.encrypt(dataBytes);
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  export function decryptAes(data: string, key: string): string {
    const encryptedBytes = aesjs.utils.hex.toBytes(data);
    const keyBytes = aesjs.utils.hex.toBytes(key);
    const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes);
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }
}