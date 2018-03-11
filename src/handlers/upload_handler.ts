/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 处理上传业务
|
*/

import BaseHandler from '../base_class/base_handler'

export default class UploadHandler extends BaseHandler {
  public async imageUpload(): Promise<void> {
    console.log(this.ctx)
  }
}