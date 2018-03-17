import Jwt from './jwt';
import Mail from './mail';
import Uploads from './uploads';
import CacheManager from './cache';

declare module 'egg' {
  // 拓展 egg 的 Application
  export interface Context {
    // 放置各类处理额外业务逻辑处理
    handlers: {
      jwt: Jwt;
      mail: Mail;
      uploads: Uploads;
      cache: CacheManager;
    }
  }
}
