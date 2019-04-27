import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';
import { Key } from './key';

export class PublicKey extends Key {
  public decrypt(data: string): string {
    const publicKeyBuffer = this.toBuffer();
    const signedMessageBuffer = naclutil.decodeBase64(data);

    const message = nacl.sign.open(signedMessageBuffer, publicKeyBuffer);

    if (!message) {
      throw new Error('Could not decrypt message');
    }

    return naclutil.encodeUTF8(message);
  }
}