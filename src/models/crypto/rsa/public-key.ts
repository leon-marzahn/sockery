import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';
import { Key } from './key';
import { PrivateKey } from './private-key';
import { RSA } from './index';

export class PublicKey extends Key {
  public encrypt(data: string, privateKey: PrivateKey): string {
    const publicKeyBuffer = this.toBuffer();
    const messageBuffer = naclutil.decodeUTF8(data);
    const nonce = RSA.newNonce();
    const box = nacl.box(messageBuffer, nonce, publicKeyBuffer, privateKey.toBuffer());

    const encryptedMessage = new Uint8Array(nonce.length + box.length);
    encryptedMessage.set(nonce);
    encryptedMessage.set(box, nonce.length);

    return naclutil.encodeBase64(encryptedMessage);
  }
}