import express = require('express');
import * as http from 'http';
import * as SocketIO from 'socket.io';
import { SecureSocket } from './models';
import { Logger } from './logger';

export enum SocketIOEvent {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect'
}

export class Server {
  public sockets: SecureSocket[] = [];

  private expressApp: express.Express;
  private readonly httpServer: http.Server;
  private socketIO: SocketIO.Server;

  public constructor() {
    this.expressApp = express();
    this.httpServer = http.createServer();
    this.socketIO = SocketIO.listen(this.httpServer);
  }

  public listen(port: number): void {
    this.socketIO.on(SocketIOEvent.CONNECTION, this.onConnection);

    this.httpServer.listen(port, () => {
      Logger.info('Initialized.');
    });
  }

  private onConnection(socket: SocketIO.Socket): void {
    const secureSocket = new SecureSocket(socket);
    this.sockets.push(secureSocket);

    secureSocket.initialize();

    socket.on(SocketIOEvent.DISCONNECT, () => this.onDisconnected(secureSocket))
  }

  private onDisconnected(secureSocket: SecureSocket): void {
    this.sockets.splice(this.sockets.indexOf(secureSocket), 1);

    Logger.info(`${secureSocket.getId()} disconnected.`);
  }
}
