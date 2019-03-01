/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| ManageResourceManageResource
|
*/

import { controller, provide, post, get, Context } from 'midway';
import { Upload } from '@my_foundation/support/upload';
import * as path from 'path';
import * as fs from 'fs-extra';

@provide()
@controller('/resources')
export class ManageResourceController {
  /**
   * 图片上传
   */
  @post('/uploads/image')
  async image(ctx: Context) {
    ctx.body = await (new Upload(ctx))
      .setMaxSize(1)
      .setWhiteList([ ...ctx.app.config.myApp.uploadImageWhiteList ])
      .handle('images');
  }

  /**
   * 文件下载
   *
   * @param {Context} ctx
   */
  @get('/uploads/download')
  async download(ctx: Context) {
    const filePath = path.resolve((ctx.app.config as any).static.dir,
      'uploads/images/2019/02/25/e226084d1767e63731e74e785947c9d8.png');
    ctx.attachment('hello.png');
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.body = fs.createReadStream(filePath);
  }
}
