/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 入口基类
|
*/

import * as crypto from 'crypto';

export class Encryptor {

  /**
   * 解密数据
   *
   * @param {string} sessionKey
   * @param {string} iv
   * @param {string} encrypted
   */
  async decryptData(sessionKey: string, iv: string, encrypted: string) {
    const sessionKeyBuffer = Buffer.from(sessionKey, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');
    const encryptedBuffer = Buffer.from(encrypted, 'base64');

    return this.decipherData(sessionKeyBuffer, ivBuffer, encryptedBuffer);
  }

  /**
   * 解密数据
   *
   * @private
   * @param {Buffer} sessionKey
   * @param {Buffer} iv
   * @param {Buffer} encrypted
   */
  private async decipherData(sessionKey: Buffer, iv: Buffer, encrypted: Buffer) {
    try {
      const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);

      const decoded = decipher.update(encrypted as any, 'binary', 'utf8') + decipher.final('utf8');

      return JSON.parse(decoded);
    } catch (err) {
      throw new Error('解密失败');
    }
  }
}
