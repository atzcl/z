import BaseRepository from '../../repository';

export default class WeChatUserRepository extends BaseRepository {
  get model () {
    return this.ctx.model.WechatUser;
  }

  /**
   * 扫码临时二维码登录
   *
   * @returns any
   */
  public async scanQrCodeLogin (userInfo: any) {
    return this.firstOrCreate([ { open_id: userInfo.open_id } ], userInfo);
  }
}
