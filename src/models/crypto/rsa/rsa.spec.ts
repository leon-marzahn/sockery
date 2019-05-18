import { RSA } from './rsa';

describe('RSA', () => {
  it('should generate new nonce', () => {
    const nonce = RSA.newNonce();
    expect(nonce.length).toEqual(24);
  });

  it('should generate keypair', () => {
    const keypair = RSA.generateKeypair();

    expect(keypair.privateKey.toBuffer().length).toEqual(32);
    expect(keypair.publicKey.toBuffer().length).toEqual(32);
  });
});