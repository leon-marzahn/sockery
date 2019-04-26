import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';
import * as aesjs from 'aes-js';

export namespace Crypto {
  /// RSA //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  export function newNonce () {
    return nacl.randomBytes(nacl.secretbox.nonceLength);
  }

  export class PublicKey {
    private readonly value: string;

    public constructor(key: string) {
      this.value = key;
    }

    public decrypt(data: string): string {
      const publicKeyBuffer = this.toBuffer();
      const signedMessageBuffer = naclutil.decodeBase64(data);

      const signature = nacl.sign.detached.verify()
      const message = nacl.sign.open(signedMessageBuffer, publicKeyBuffer);

      if (!message) {
        throw new Error('Could not decrypt message');
      }

      return naclutil.encodeUTF8(message);
    }

    public toString(): string {
      return this.value;
    }

    public toBuffer(): Uint8Array {
      return naclutil.decodeBase64(this.value);
    }
  }

  export class PrivateKey {
    private readonly value: string;

    public constructor(key: string) {
      this.value = key;
    }

    public encrypt(data: string): string {
      const privateKeyBuffer = this.toBuffer();
      const messageBuffer = naclutil.decodeUTF8(data);

      const signedMessage = nacl.sign(messageBuffer, privateKeyBuffer);
      const signature = nacl.sign.detached(messageBuffer, privateKeyBuffer);

      const encryptedMessage = new Uint8Array(signature.byteLength + signedMessage.byteLength)

      return naclutil.encodeBase64(encryptedMessage);
    }

    public toString(): string {
      return this.value;
    }

    public toBuffer(): Uint8Array {
      return naclutil.decodeBase64(this.value);
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
    const keypair = nacl.sign.keyPair();
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