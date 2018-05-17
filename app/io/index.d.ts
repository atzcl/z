import LoginQrCodeController from './controller/login_qr_code';

declare module 'egg' {
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
}
