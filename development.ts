import io from 'socket.io-client';
import { Crypto, Server } from './src';
import { ClientSecureSocket } from './src/models/client-secure-socket';

const server = new Server();
server.addListeners([]);
server.listen(8082);

const socket = new ClientSecureSocket(io('http://localhost:8082', {
  reconnection: false
}));
socket.initialize();