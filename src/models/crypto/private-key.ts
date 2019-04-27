import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';
import { Key } from './key';

export class PrivateKey extends Key {
  public encrypt(data: string): string {
    const privateKeyBuffer = this.toBuffer();
    const messageBuffer = naclutil.decodeUTF8(data);

    const signedMessage = nacl.sign(messageBuffer, privateKeyBuffer);

    return naclutil.encodeBase64(signedMessage);
  }
}