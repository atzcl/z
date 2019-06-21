import { provide, controller, get, all } from 'midway';
import { Controller } from '../foundation/Bases/BaseController';

@provide()
@controller('/')
export class HomeController extends Controller {

  @get('/')
  async index() {
    this.ctx.body = `~~`;
  }

  // 将路由交给前端页面接管
  @all('/dashboard(/.+)?')
  async system() {
    await this.ctx.body.render('home/index.html');
  }
}
