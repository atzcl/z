/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 微信支付
|
*/

import { BaseClient } from '../Kernel/BaseClient';

/**
 * @see https://developers.weixin.qq.com/miniprogram/dev/api-backend/auth.code2Session.html
 */

export interface IUnifyParams {
  openid: string;
  body: string;
  out_trade_no: string;
  total_fee: number;
  /**
   * @see https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=4_2
   */
  trade_type?: 'JSAPI' | 'NATIVE' | 'APP' | 'MWEB' | 'MICROPAY';
  appid?: string;
  spbill_create_ip?: string;
  notify_url?: string;
}

export class Client extends BaseClient {
  /**
   * 统一下单
   *
   * @desc 参数 appid, mch_id, nonce_str, sign, sign_type 可不用传入
   *
   * @param {IUnifyParams} params 下单的参数
   */
  async unify(params: IUnifyParams): Promise<any> {
    if (! params.spbill_create_ip) {
      params.spbill_create_ip = '127.0.0.1';
    }

    const config = this.config.payment;

    params.appid = config.app_id;
    params.notify_url = params.notify_url || config.notify_url;
    params.trade_type = params.trade_type || 'JSAPI';

    return this.request(await this.wrap('pay/unifiedorder'), params);
  }

  /**
   * 根据商户订单号查询订单状态
   *
   * @param {string} number
   */
  async queryByOutTradeNumber(number: string) {
    return this.query({ out_trade_no: number });
  }

  /**
   * 根据微信订单号查询订单状态
   *
   * @param {string} transactionId
   */
  async queryByTransactionId(transactionId: string) {
    return this.query({ transaction_id: transactionId });
  }

  /**
   * 传入 [ 商户系统内部的订单号 ] 来关闭订单
   *
   * @param {string} tradeNo
   */
  async close(tradeNo: string) {
    return this.request(await this.wrap('pay/closeorder'), {
      appid: this.config.payment.app_id,
      out_trade_no: tradeNo,
    });
  }

  /**
   * 发起查询请求
   *
   * @param {any} params
   */
  protected async query(params: any) {
    params.appid = this.config.payment.app_id;

    return this.request(await this.wrap('pay/orderquery'), params);
  }
}
