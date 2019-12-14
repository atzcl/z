/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 上传类
|
*/

import * as path from 'path';

import { Context } from 'midway';
import * as fs from 'fs-extra';
import * as dayjs from 'dayjs';
import * as pump from 'mz-modules/pump';

import helper from '@/app/extend/helper';


export interface UploadResult {
  name: string;
  old_name: string;
  type: string;
  mime: string;
  size: number;
  path: string;
  info: object;
}

interface UploadOptions {
  whitelist?: string[];
  autoFields?: boolean;
  defCharset?: string;
  // eggjs 定义的 GetFileStreamOptions 没有导出，所以 copy 一份来用
  limits?: {
    fieldNameSize?: number,
    fieldSize?: number,
    fields?: number,
    fileSize?: number,
    files?: number,
    parts?: number,
    headerPairs?: number,
  };
  checkFile?: (fieldname: string, fileStream: any, filename: string) => void | Error;
}

export class Upload {
  ctx: Context;

  options: UploadOptions = {
    limits: {
      fileSize: 0,
    },
  };

  constructor(ctx: Context, options?: UploadOptions) {
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
  async handle(uploadType = 'images') {
    try {
      const { whitelist, limits = {} } = this.options;

      // 获取文件的流
      const stream = await this.ctx.getFileStream(limits as any);

      // 验证文件格式
      helper.checkUploadFileExt(stream.filename, whitelist || []);

      const { newFileName, newFullFileName, fileType } = this.generateNewFileName(stream.filename);

      // 上传目录
      const { uploadDir, relativeDir } = this.ensureUploadDirHnadler(uploadType);
      // 创建写入流
      const writeStream = fs.createWriteStream(`${uploadDir}/${newFullFileName}`);
      // 写入文件
      await pump(stream, writeStream);

      // 因为 egg-multipart 并没有返回 size, 所以这里直接信任前端传回的大小吧
      let size = stream.fields.size || 0;
      if (Number(size) > (limits.fileSize || 0)) {
        size = limits.fileSize || 0
      }

      // todo: 后面可以把这部分给返回给调用方去处理
      return {
        name: newFileName,
        old_name: stream.filename,
        type: fileType.slice(1),
        mime: stream.mimeType,
        size,
        path: `${relativeDir}/${newFullFileName}`,
        info: this.ctx.helper.safeJsonParse(stream.fields.info),
      };
    } catch (error) {
      let { message } = error;
      const { name, status } = error;

      // 替换原有的上传大小限制提示
      if (name === 'MultipartFileTooLargeError' && status === 413) {
        message = '上传的文件大小超过了限制';
      }

      this.ctx.abort(status, message);
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
    const relativeDir = `/public/uploads/${baseDirName}/${dayjs().format('YYYY/MM/DD')}`;
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
    const newFileName = helper.generateUniqId();
    // 文件类型
    const fileType = path.extname(filename).toLowerCase();
    // 组合为新的文件名称
    const newFullFileName = newFileName + fileType;

    return { newFileName, newFullFileName, fileType };
  }
}
