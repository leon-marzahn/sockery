import { AES } from './aes';

describe('AES', () => {
  it('should generate aes key with 1 bit', () => {
    const key = AES.generateKey(1);
    expect(key.length).toEqual(2);
  });

  it('should generate aes key with 128 bit', () => {
    const key = AES.generateKey(128);
    expect(key.length).toEqual(32);
  });

  it('should encrypt message', () => {
    const key = AES.generateKey(128);
    const message = 'test';
    const encryptedMessage = AES.encrypt(message, key);

    expect(encryptedMessage).not.toEqual(
      expect.stringContaining(message)
    );
    expect(encryptedMessage.length).toEqual(8);
  });

  it('should decrypt message', () => {
    const key = AES.generateKey(128);
    const message = 'test';
    const encryptedMessage = AES.encrypt(message, key);

    const decryptedMessage = AES.decrypt(encryptedMessage, key);
    expect(decryptedMessage).toEqual(message);
  });
});