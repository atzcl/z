/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 素材管理
|
*/

import * as fs from 'fs-extra';

import BaseClient from '../../Kernel/BaseClient';
import { MaterialException } from '../../Kernel/Exceptions/MaterialException';


export class Client extends BaseClient {
  protected allowTypes = ['image', 'voice', 'video', 'thumb', 'news_image'];

  /**
   * 上传图片
   *
   * @description 注意：微信图片上传服务有敏感检测系统，图片内容如果含有敏感内容，如色情，商品推广，虚假信息等，上传可能失败。
   *
   * @param {string} path 路径
   */
  async uploadImage(path: string) {
    this.upload('image', path);
  }

  /**
   * 上传语音
   *
   * @description 语音 大小不超过 5M，长度不超过 60 秒，支持 mp3/wma/wav/amr 格式。
   *
   * @param {string} path 路径
   */
  async uploadVoice(path: string) {
    //
  }

  /**
   * 上传视频
   *
   * @param {string} path 路径
   */
  async uploadVideo(path: string) {
    //
  }

  /**
   * 上传缩略图
   *
   * @param {string} path 路径
   */
  async uploadThumb(path: string) {
    //
  }

  /**
   * 上传素材
   *
   * @param {string} type
   * @param {string} path
   * @param {*} [params={}]
   *
   * @returns {any}
   */
  async upload(type: string, path: string, params = {}) {
    if (! fs.pathExistsSync(path)) {
      throw new MaterialException(422, `File does not exist, or the file is unreadable: ${path}`);
    }

    const formData = {
      media: fs.createReadStream(path),
    };

    params = { ...params, type };

    return this.httpUpload(this.getApiByType(type), formData, { params });
  }

  /**
   * 获取 api 类型
   *
   * @param {string} type
   *
   * @returns {string}
   */
  getApiByType(type: string) {
    switch (type) {
      case 'news_image':
        return 'cgi-bin/media/uploadimg';
      default:
        return 'cgi-bin/material/add_material';
    }
  }
}
