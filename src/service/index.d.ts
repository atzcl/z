import ExceptionService from './exceptions';
import AuthService from './auth';
import MailService from './mail';

declare module 'egg' {
  // 拓展 egg 的 app.service 对象，导出项目编写的 Controller 给 TypeScript
  export interface IService {
    auth: AuthService;
    mail: MailService;
    exceptions: ExceptionService;
  }
}