import { AES } from './aes';

describe('AES', () => {
  it('should generate aes key with 1 bit', () => {
    const key = AES.generateKey(1);
    expect(key.length).toBe(2);
  });
});