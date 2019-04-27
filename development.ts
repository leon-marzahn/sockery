import { Crypto } from './src';

// const server = new Server();
// server.listen(8082);

console.time('Generate KeyPair');
const keypair: Crypto.RSA.Keypair = Crypto.RSA.generateKeyPair();
console.timeEnd('Generate KeyPair');

const message = 'Hello fren, how is your day going?';

console.time('Encrypt Message');
const encryptedMessage = keypair.publicKey.encrypt(message, keypair.privateKey);
console.timeEnd('Encrypt Message');
console.log('Encrypted Message:', encryptedMessage);

console.time('Decrypt Message');
const decryptedMessage = keypair.privateKey.decrypt(encryptedMessage);
console.timeEnd('Decrypt Message');
console.log('Decrypted Message:', decryptedMessage);