/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 微信二维码
|
*/

import { isInteger } from 'lodash'
import BaseHandler from '../base_handler'

export default class QrCode extends BaseHandler {
  // 一天的秒值
  private DAY = 86400
  // 用于限制永久二维码的 value, 永久二维码时最大值为 100000（目前参数只支持1 --100000）
  private SCENE_MAX_VALUE = 100000
  // 临时二维码的整型参数值
  private SCENE_QR_TEMPORARY = 'QR_SCENE'
  // 临时二维码的字符串参数值
  private SCENE_QR_TEMPORARY_STR = 'QR_STR_SCENE'
  // 永久二维码的整型参数值
  private SCENE_QR_FOREVER = 'QR_LIMIT_SCENE'
  // 永久二维码的字符串参数值
  private SCENE_QR_FOREVER_STR = 'QR_LIMIT_STR_SCENE'

  /**
   * 生成永久二维码
   *
   * @param {string|number} sceneValue 二维码值
   */
  public async forever (sceneValue: string | number) {
    // 默认为字符串类型
    let type = this.SCENE_QR_FOREVER_STR
    let sceneKey = 'scene_str'

    // 判断是否为整型二维码
    if (isInteger(sceneValue) && sceneValue > 0 && sceneValue < this.SCENE_MAX_VALUE) {
      type = this.SCENE_QR_FOREVER
      sceneKey = 'scene_id'
    }

    // 组装参数
    let scene: any = {}
    scene[sceneKey] = sceneValue

    // 生成二维码
    return this.create(type, scene, false)
  }

  /**
   * 生成临时二维码
   *
   * @param {string|number} sceneValue 二维码值
   * @param {number} expireSeconds 过期时间
   */
  public async temporary (sceneValue: string | number, expireSeconds?: number) {
    // 默认为字符串类型
    let type = this.SCENE_QR_TEMPORARY_STR
    let sceneKey = 'scene_str'

    // 判断是否为整型二维码
    if (isInteger(sceneValue) && sceneValue > 0) {
      type = this.SCENE_QR_TEMPORARY
      sceneKey = 'scene_id'
    }

    // 组装参数
    let scene: any = {}
    scene[sceneKey] = sceneValue

    // 生成二维码
    return this.create(type, scene, true, expireSeconds)
  }

  /**
   * 通过 ticket 换取二维码
   *
   * @param {string} ticket 获取的二维码的参数
   */
  public async url (ticket: string) {
    return `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURI(ticket)}`
  }

  /**
   * 创建二维码
   *
   * @param {string} actionName 二维码类型
   * @param {object} actionInfo 二维码详细信息
   * @param {boolean} temporary 临时二维码 or 永久二维码
   * @param {number} expireSeconds 过期时间 [ 临时二维码 ]
   */
  public async create (
    actionName: string,
    actionInfo: object,
    temporary: boolean = true,
    expireSeconds: number = 0
  ) {
    // 判断如果过期时间不填的话，默认为 2 小时
    if (expireSeconds === 0) {
      expireSeconds = 7200
    }

    // 组装获取二维码参数
    let params: any = {
      action_name: actionName,
      action_info: {
        scene: actionInfo
      }
    }

    if (temporary) {
      // 获取最小值
      params.expire_seconds = Math.min(expireSeconds, 30 * this.DAY)
    }

    return this.ctx.handlers.wechat.request.post('qrcode/create', { data: params })
  }
}
