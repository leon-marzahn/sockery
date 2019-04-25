import express = require('express');
import * as http from 'http';
import * as SocketIO from 'socket.io';
import { SecureSocket } from './models';
import { Logger } from './logger';

export class Server {
  public sockets: SecureSocket[] = [];

  private app: express.Express;
  private readonly httpServer: http.Server;
  private io: SocketIO.Server;

  public constructor() {
    this.app = express();
    this.httpServer = http.createServer();
    this.io = SocketIO.listen(this.httpServer);
  }

  public listen(port: number): void {
    this.io.on('connection', this.onConnection);

    this.httpServer.listen(port, () => {
      Logger.info('Initialized.');
    });
  }

  private onConnection(socket: SocketIO.Socket): void {
    const sSocket = new SecureSocket(socket);
    this.sockets.push(sSocket);

    socket.on('disconnect', () => this.onDisconnected(sSocket))
  }

  private onDisconnected(sSocket: SecureSocket): void {
    const i = this.sockets.indexOf(sSocket);
    this.sockets.splice(i, 1);

    Logger.info(`${sSocket.getCustomId()} disconnected.`);
  }
}
