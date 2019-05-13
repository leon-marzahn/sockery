import express = require('express');
import * as http from 'http';
import * as SocketIO from 'socket.io';
import { SecureSocket } from './models';
import { Logger } from './logger';
import { Listener } from './models/listener';

export enum SocketIOEvent {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect'
}

import * as defaultListeners from './listeners';

export class Server {
  public sockets: SecureSocket[] = [];
  public listeners: Listener[] = [];

  private expressApp: express.Express;
  private readonly httpServer: http.Server;
  private socketIO: SocketIO.Server;

  public constructor() {
    this.expressApp = express();
    this.httpServer = http.createServer();
    this.socketIO = SocketIO.listen(this.httpServer);
  }

  public listen(port: number): void {
    this.socketIO.on(SocketIOEvent.CONNECTION, socket => this.onConnection(socket));

    this.httpServer.listen(port, () => {
      Logger.info('Initialized.');
    });
  }

  public addListeners(listeners: Listener[]): void {
    this.listeners.push(...listeners);
  }

  private onConnection(socket: SocketIO.Socket): void {
    const secureSocket = new SecureSocket(socket);
    this.sockets.push(secureSocket);

    secureSocket.initialize();

    // ToDo: Add subscribers to listener instead of this
    for (const listener in defaultListeners) {
      const listenerInstance: Listener = new (defaultListeners as any)[listener](secureSocket);
      listenerInstance.initialize();
      this.listeners.push(listenerInstance);
    }

    socket.on(SocketIOEvent.DISCONNECT, () => this.onDisconnected(secureSocket))
  }

  private onDisconnected(secureSocket: SecureSocket): void {
    this.sockets.splice(this.sockets.indexOf(secureSocket), 1);

    Logger.info(`${secureSocket.getId()} disconnected.`);
  }
}
