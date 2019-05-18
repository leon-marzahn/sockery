import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';
import { Key } from './key';
import { PublicKey } from './public-key';
import { DecryptFailedException } from '../../../exceptions';

export class PrivateKey extends Key {
  /**
   * Decrypts a payload via the receivers private key and the peers public key
   *
   * @param payload: Payload to decrypt
   * @param peerPublicKey: Peers public key
   */
  public decrypt(payload: string, peerPublicKey: PublicKey): string {
    const privateKeyBuffer = this.toBuffer();

    const messageWithNonceBuffer = naclutil.decodeBase64(payload);
    const nonce = messageWithNonceBuffer.slice(0, nacl.box.nonceLength);
    const messageBuffer = messageWithNonceBuffer.slice(
      nacl.box.nonceLength,
      payload.length
    );

    const decryptedMessageBuffer = nacl.box.open(messageBuffer, nonce, peerPublicKey.toBuffer(), privateKeyBuffer);

    if (!decryptedMessageBuffer) {
      throw new DecryptFailedException();
    }

    return naclutil.encodeUTF8(decryptedMessageBuffer);
  }
}