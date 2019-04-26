import { Server, Crypto } from './src';

// const server = new Server();
// server.listen(8082);

const keyPair = Crypto.generateKeyPair();
console.log(keyPair.publicKey.toString());
console.log(keyPair.privateKey.toString());