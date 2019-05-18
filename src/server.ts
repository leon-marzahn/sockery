import express from 'express';
import * as http from 'http';
import * as SocketIO from 'socket.io';
import { Logger } from './logger';
import { Listener } from './models/listener';
import { find } from 'lodash';
import { EventExistsException } from './exceptions';
import { ServerSecureSocket } from './models';

export enum SocketIOEvent {
  CONNECTION = 'connection',
  DISCONNECT = 'disconnect'
}

import * as defaultListeners from './listeners';

export class Server {
  public sockets: ServerSecureSocket[] = [];
  public listeners: Listener[] = [];

  private expressApp: express.Express;
  private readonly httpServer: http.Server;
  private socketIO: SocketIO.Server;

  public constructor() {
    this.expressApp = express();
    this.httpServer = http.createServer();
    this.socketIO = SocketIO.listen(this.httpServer);

    this.addListenersFromImport(defaultListeners);
  }

  public listen(port: number): void {
    this.socketIO.on(SocketIOEvent.CONNECTION, socket => this.onConnection(socket));
    this.httpServer.listen(port, () => {
      Logger.info('Initialized.');
    });
  }

  public addListeners(listeners: Listener[]): void {
    listeners.forEach(listener => {
      if (
        find(this.listeners, thisListener => thisListener.getOptions().event === listener.getOptions().event)
      ) {
        throw new EventExistsException();
      }
    });

    this.listeners.push(...listeners);
  }

  public addListenersFromImport(listeners: any): void {
    for (const listener in listeners) {
      const listenerInstance: Listener = new (listeners)[listener]();
      this.addListeners([listenerInstance]);
    }
  }

  private onConnection(socket: SocketIO.Socket): void {
    const secureSocket = new ServerSecureSocket(socket);
    this.sockets.push(secureSocket);

    secureSocket.initialize();
    this.listeners.forEach(listener => {
      listener.initializeSocket(secureSocket)
    });

    socket.on(SocketIOEvent.DISCONNECT, () => this.onDisconnected(secureSocket))
  }

  private onDisconnected(secureSocket: ServerSecureSocket): void {
    this.sockets.splice(this.sockets.indexOf(secureSocket), 1);

    Logger.info(`${secureSocket.getId()} disconnected.`);
  }
}
