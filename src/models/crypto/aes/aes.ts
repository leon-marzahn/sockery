import * as aesjs from 'aes-js';

export namespace AES {
  export function generateKey(bits: number): string {
    const aesKey: number[] = [];

    for (let i = 0; i < (bits / 8); i++) {
      aesKey.push(Math.floor(Math.random() * Math.floor(256)));
    }

    const aesKeyBytes = new Uint8Array(aesKey);
    return aesjs.utils.hex.fromBytes(aesKeyBytes);
  }

  export function encrypt(payload: string, key: string): string {
    const payloadBytes = aesjs.utils.utf8.toBytes(payload);
    const keyBytes = aesjs.utils.hex.toBytes(key);
    const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes);
    const encryptedBytes = aesCtr.encrypt(payloadBytes);
    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  export function decrypt(payloadBytes: string, key: string): string {
    const encryptedBytes = aesjs.utils.hex.toBytes(payloadBytes);
    const keyBytes = aesjs.utils.hex.toBytes(key);
    const aesCtr = new aesjs.ModeOfOperation.ctr(keyBytes);
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }
}