import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';
import * as aesjs from 'aes-js';

import { PublicKey as PublicKeyImport } from './public-key';
import { PrivateKey as PrivateKeyImport } from './private-key';
import { Keypair as KeypairImport } from './keypair';

export namespace Crypto {
  /// RSA //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  export function newNonce() {
    return nacl.randomBytes(nacl.secretbox.nonceLength);
  }

  export class PublicKey extends PublicKeyImport {
  }

  export class PrivateKey extends PrivateKeyImport {
  }

  export class Keypair extends KeypairImport {
  }

  export function generateKeyPair(): Keypair {
    const keypair = nacl.sign.keyPair();
    const publicKey = naclutil.encodeBase64(keypair.publicKey);
    const privateKey = naclutil.encodeBase64(keypair.secretKey);

    return new Keypair(new PublicKey(publicKey), new PrivateKey(privateKey));
  }

  /// AES //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  export function generateAesKey(bits: number): string {
    const aesKey: number[] = [];

    for (let i = 0; i < (bits / 8); i++) {
      aesKey.push(Math.floor(Math.random() * Math.floor(256)));
    }

    const aesKeyBytes = new Uint8Array(aesKey);
    return aesjs.utils.hex.fromBytes(aesKeyBytes);
  }

  export function encryptAes(data: string, key: string): string {
    const dataBytes = aesjs.utils.utf8.toBytes(data);
    const keyBytes = aesjs.utils.hex.toBytes(key);
    const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes);
    const encryptedBytes = aesCtr.encrypt(dataBytes);
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  export function decryptAes(data: string, key: string): string {
    const encryptedBytes = aesjs.utils.hex.toBytes(data);
    const keyBytes = aesjs.utils.hex.toBytes(key);
    const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes);
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }
}