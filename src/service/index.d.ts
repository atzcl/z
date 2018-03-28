import ExceptionService from './exceptions';

declare module 'egg' {
  // 拓展 egg 的 app.service 对象，导出项目编写的 Controller 给 TypeScript
  export interface IService {
    extend: {
      exceptions: ExceptionService;
    }
  }
}