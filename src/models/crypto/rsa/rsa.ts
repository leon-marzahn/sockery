import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';

import * as KeypairImport from './keypair';
import * as PublicKeyImport from './public-key';
import * as PrivateKeyImport from './private-key';

export namespace RSA {
  export import Keypair = KeypairImport.Keypair;
  export import PublicKey = PublicKeyImport.PublicKey;
  export import PrivateKey = PrivateKeyImport.PrivateKey;

  export function newNonce() {
    return nacl.randomBytes(nacl.secretbox.nonceLength);
  }

  export function generateKeypair(): Keypair {
    const keypair = nacl.box.keyPair();
    const publicKey = naclutil.encodeBase64(keypair.publicKey);
    const privateKey = naclutil.encodeBase64(keypair.secretKey);

    return new Keypair(new PublicKey(publicKey), new PrivateKey(privateKey));
  }
}