import { RSA } from './rsa';
import { DecryptFailedException } from '../../../exceptions';

describe('Private Key', () => {
  it('should decrypt message', () => {
    const keypair = RSA.generateKeypair();
    const peerKeypair = RSA.generateKeypair();
    const message = 'test';
    const encryptedMessage = peerKeypair.publicKey.encrypt(message, keypair.privateKey);

    const decryptedMessage = keypair.privateKey.decrypt(encryptedMessage, peerKeypair.publicKey);
    expect(decryptedMessage).toEqual(message);
  });

  it('should fail decrypting message when using own public key', () => {
    const keypair = RSA.generateKeypair();
    const peerKeypair = RSA.generateKeypair();
    const message = 'test';
    const encryptedMessage = peerKeypair.publicKey.encrypt(message, keypair.privateKey);

    expect(() => {
      keypair.privateKey.decrypt(encryptedMessage, keypair.publicKey);
    }).toThrow(DecryptFailedException);
  });
});