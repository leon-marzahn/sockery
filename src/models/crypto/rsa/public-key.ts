import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';
import { Key } from './key';
import { PrivateKey } from './private-key';
import { RSA } from './rsa';

export class PublicKey extends Key {
  /**
   * Encrypts a payload via the peers public key and the senders private key
   *
   * @param payload: Payload to encrypt
   * @param privateKey: Senders private key
   */
  public encrypt(payload: string, privateKey: PrivateKey): string {
    const publicKeyBuffer = this.toBuffer();
    const messageBuffer = naclutil.decodeUTF8(payload);
    const nonce = RSA.newNonce();
    const box = nacl.box(messageBuffer, nonce, publicKeyBuffer, privateKey.toBuffer());

    const encryptedMessage = new Uint8Array(nonce.length + box.length);
    encryptedMessage.set(nonce);
    encryptedMessage.set(box, nonce.length);

    return naclutil.encodeBase64(encryptedMessage);
  }
}