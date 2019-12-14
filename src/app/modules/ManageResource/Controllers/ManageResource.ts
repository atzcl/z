/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| ManageResourceManageResource
|
*/

import * as path from 'path';

import { controller, provide, post, get, Context } from 'midway';
import * as fs from 'fs-extra';
import { Upload } from '@app/foundations/Support/Upload';

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
      .setWhiteList([...ctx.app.config.myApp.uploadImageWhiteList])
      .handle('images');
  }

  /**
   * 文件下载
   *
   * @param {Context} ctx
   */
  @get('/uploads/download')
  async download(ctx: Context) {
    const { dir } = ctx.app.config.static;

    const filePath = path.resolve(String(dir), 'uploads/images/2019/02/25/e226084d1767e63731e74e785947c9d8.png');
    ctx.attachment('hello.png');
    ctx.set('Content-Type', 'application/octet-stream');
    ctx.body = fs.createReadStream(filePath);
  }
}
