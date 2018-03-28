import * as SocketIO from 'socket.io';
import LoginQrCodeController from './controller/login_qr_code';

declare module 'egg' {
  export interface Application {
    io: SocketIO.Server & EggSocketIO & Namespace;
  }

  export interface Context {
    socket: any
  }
  
  interface EggSocketIO {
    middleware: CustomMiddleware;
    controller: CustomController;
  }

  /** declare custom middlerwares (connectionMiddleware & packetMiddlerware) in app/io */
  interface CustomMiddleware {
    packet(): any
  }
  /** declare custom controllers in app/io */
  interface CustomController {
    loginQrCode: LoginQrCodeController
  }

  interface Namespace {
    route(event: string, handler: Function): any
  }
}
