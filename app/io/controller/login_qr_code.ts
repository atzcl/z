import { Controller } from 'egg';

export default class LoginQrCodeController extends Controller {
  async index (): Promise<void> {
    // 获取客户端发送的数据
    // console.log(this.ctx.socket)
    // const message = this.ctx.args[0] || ''
    // // console.log('chats :', message + ' : ' + process.pid)
    // // this.app.io.clients((error: any, clients: any) => {
    // //   console.log(error, clients)
    // // })
    // // const say = await (this as any).ctx.service.user.say()
    // if (message === 'success') {
    //   this.ctx.socket.emit(this.ctx.socket.id, { type: 'wechatLogin', url: 'xxxxx' })
    // } else {
    //   this.app.io.to(this.ctx.socket.id).emit('getLoginQrCodeUrl', { type: 'wechatLogin', url: '只传递给特定的人' })
    // }
  }
}
