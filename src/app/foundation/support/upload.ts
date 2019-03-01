/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 上传类
|
*/

import { Context } from 'midway';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as Moment from 'moment';
import * as pump from 'mz-modules/pump';

interface IUploadOptions {
  whitelist?: string[];
  autoFields?: boolean;
  defCharset?: string;
  // eggjs 定义的 GetFileStreamOptions 没有导出，所以 copy 一份来用
  limits?: {
    fieldNameSize?: number;
    fieldSize?: number;
    fields?: number;
    fileSize?: number;
    files?: number;
    parts?: number;
    headerPairs?: number;
  };
  checkFile?: (fieldname, fileStream, filename) => void | Error;
}

export class Upload {
  ctx: Context;

  options: IUploadOptions = {};

  constructor(ctx: Context, options?: IUploadOptions) {
    this.ctx = ctx;

    if (options) {
      this.options = options;
    }
  }

  /**
   * 设置上传大小限制
   *
   * @param {number} size
   */
  setMaxSize(size: number) {
    this.options.limits = { ...this.options.limits, fileSize: size * 1024 * 1024 };

    return this;
  }

  /**
   * 设置上传格式白名单
   *
   * @param {number} size
   */
  setWhiteList(whitelist: string[]) {
    this.options.whitelist = whitelist;

    return this;
  }

  /**
   * 上传处理
   *
   * @param {uploadType} 上传类型(也是实际的目录)
   *
   * @returns {object}
   */
  async handle (uploadType: string = 'images') {
    const { helper, app } = this.ctx;
    const { whitelist, limits } = this.options;

    try {
      // 获取文件的流
      const stream = await this.ctx.getFileStream(limits || {} as any);

      // 验证文件格式
      helper.checkUploadFileExt(stream.filename, whitelist || []);

      const { newFileName, newFullFileName, fileType } = this.generateNewFileName(stream.filename);

      // 上传目录
      const { uploadDir, relativeDir } = this.ensureUploadDirHnadler(uploadType);
      // 创建写入流
      const writeStream = fs.createWriteStream(`${uploadDir}/${newFullFileName}`);
      // 写入文件
      await pump(stream, writeStream);

      // todo: 后面可以把这部分给返回给调用方去处理
      return {
        success: true,
        name: newFileName,
        old_name: stream.filename,
        type: fileType.slice(1),
        mime: stream.mimeType,
        size: stream.encoding,
        path: `${relativeDir}/${newFullFileName}`,
        url: `${app.config.myApp.appUrl}${relativeDir}/${newFullFileName}`,
      };
    } catch (e) {
      let message = e.message;
      // 替换原有的上传大小限制提示
      if (e.name === 'MultipartFileTooLargeError' && e.status === 413) {
        message = '上传的文件大小超过了限制';
      }

      this.ctx.abort(e.status, message);
    }
  }

  /**
   * 确保上传目录的存在
   *
   * @param {Context} ctx 上下文
   * @param {string} baseDirName 基础目录名称，比如 images、videos
   */
  private ensureUploadDirHnadler(baseDirName: string) {
    // 相对地址
    const relativeDir = `/public/uploads/${baseDirName}/${Moment().format('YYYY/MM/DD')}`;
    // 上传的目录绝对地址
    const uploadDir = path.join(this.ctx.app.baseDir, `app/${relativeDir}`);

    // 确保上传目录的存在
    fs.ensureDirSync(uploadDir);

    // 返回相对目录
    return { uploadDir, relativeDir };
  }

  /**
   * 生成新的文件名
   */
  private generateNewFileName(filename: string) {
    // 生成新的文件名
    const newFileName = this.ctx.helper.generateUniqId();
    // 文件类型
    const fileType = path.extname(filename).toLowerCase();
    // 组合为新的文件名称
    const newFullFileName = newFileName + fileType;

    return { newFileName, newFullFileName, fileType };
  }
}
