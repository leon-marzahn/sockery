import * as RSAImport from './rsa';
import * as AESImport from './aes';

export namespace Crypto {
  export import RSA = RSAImport.RSA;
  export import AES = AESImport.AES;
}