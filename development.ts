import { Server, Crypto } from './src';
import * as nacl from 'tweetnacl';
import * as naclutil from 'tweetnacl-util';

// const server = new Server();
// server.listen(8082);

console.time('Generate KeyPair');
const keypair: Crypto.Keypair = Crypto.generateKeyPair();
console.timeEnd('Generate KeyPair');

const message = 'Hello fren';

console.time('Encrypt Message');
const encryptedMessage = keypair.privateKey.encrypt(message);
console.timeEnd('Encrypt Message');
console.log('Encrypted Message:', encryptedMessage);

console.time('Decrypt Message');
const decryptedMessage = keypair.publicKey.decrypt(encryptedMessage);
console.timeEnd('Decrypt Message')
console.log('Decrypted Message:', decryptedMessage);