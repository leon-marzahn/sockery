import io from 'socket.io-client';
import { Crypto, SecureSocket, Server } from './src';

const server = new Server();
server.addListeners([]);
server.listen(8082);

const socket = io('http://localhost:8082', {
  reconnection: false
});
socket.on('connect', () => {
  const keyPair = Crypto.RSA.generateKeyPair();

  socket.emit('handshake', {
    publicKey: keyPair.publicKey.toString()
  }, (data: any) => {
    console.log(data);
  });
});