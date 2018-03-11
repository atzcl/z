import jwtHandler from './jwt_handler'
import uploadHandler from './upload_handler'

declare module 'egg' {
  // 拓展 egg 的 app.ctx
  export interface Context {
    // 放置各类处理额外业务逻辑处理
    handlers: {
      jwtHandler: jwtHandler,
      uploadHandler: uploadHandler
    }
  }
}
