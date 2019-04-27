import { PublicKey } from './public-key';
import { PrivateKey } from './private-key';

export class Keypair {
  public publicKey: PublicKey;
  public privateKey: PrivateKey;

  public constructor(publicKey: PublicKey, privateKey: PrivateKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}