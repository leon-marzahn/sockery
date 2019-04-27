import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';
import { Key } from './key';

export class PrivateKey extends Key {
  public decrypt(data: string): string {
    const privateKeyBuffer = this.toBuffer();
    const keypair = nacl.box.keyPair.fromSecretKey(privateKeyBuffer);

    const messageWithNonceBuffer = naclutil.decodeBase64(data);
    const nonce = messageWithNonceBuffer.slice(0, nacl.box.nonceLength);
    const messageBuffer = messageWithNonceBuffer.slice(
      nacl.box.nonceLength,
      data.length
    );

    const decryptedMessageBuffer = nacl.box.open(messageBuffer, nonce, keypair.publicKey, keypair.secretKey);

    if (!decryptedMessageBuffer) {
      throw new Error('Could not decrypt message');
    }

    return naclutil.encodeUTF8(decryptedMessageBuffer);
  }
}