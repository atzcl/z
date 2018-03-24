/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: 植成樑 <atzcl0310@gmail.com>  Blog：https://www.zcloop.com
+-----------------------------------------------------------------------------------------------------------------------
| 微信模板消息
|
*/

import BaseHandler from '../../base_class/base_handler'
import { forOwn, isNull, isObject } from 'lodash'

export default class TemplateMessage extends BaseHandler {
  /**
   * @var {object} 模板消息数据结构
   */
  private message = {
    touser: '',
    template_id: '',
    url: '',
    data: {}
  }

  /**
   * @var {array} 传入的模板内容数据必传属性
   */
  private required = ['touser', 'template_id']

  /**
   * 获取所有模板列表
   *
   * @returns {object}
   */
  public async getPrivateTemplates () {
    return this.ctx.handlers.wechat.request.get('template/get_all_private_template')
  }

  /**
   * 发送模板消息
   * @param {object} data 模板内容
   */
  public async send (data: object) {
    return this.ctx.handlers.wechat.request.post(
      'message/template/send', { data: await this.formatMessage(data) }
    )
  }

  /**
   * 检查 message 的数据结构
   *
   * @param {object} data 模板内容
   * @returns {object}
   */
  public async formatMessage (data: object): Promise<object> {
    // 替换预设数据
    let params = Object.assign(this.message, data)

    // 判断是否有传入必传值
    forOwn(params, (value, key) => {
      // 判断是否有传入 'touser', 'template_id'
      if (this.required.includes(key) && (isNull(value) || value === '') && (key in this.message)) {
        return this.ctx.abort(422, `${key} 必填且不能为空`)
      }
    })

    // 格式化 data 的数据结构
    params.data = await this.formatData(params.data)

    return params
  }

  /**
   * 格式化 data 的数据结构
   *
   * @param {object} data 数据
   * @returns {object}
   */
  public async formatData (data: object): Promise<object> {
    let formatted: any = {}

    // 格式化数据结构，结果 { value: xxx } or { value: xxx, color: xxx }
    forOwn(data, (value, key) => {
      formatted[key] = {}

      if (isObject(value)) {
        // 如果有传入 value
        if ('value' in value) {
          formatted[key]['value'] = value['value']
        }

        // 如果有传入 color
        if ('color' in value) {
          formatted[key]['color'] = value['color']
        }
      } else {
        // 如果只是单纯传值
        formatted[key]['value'] = value
      }
    })

    return formatted
  }
}
