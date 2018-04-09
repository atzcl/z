import { Controller } from 'egg';

export default class IndexController extends Controller {
  async index (): Promise<void> {
    await this.ctx.render('index.html');
  }

  async home (): Promise<void> {
    this.ctx.body = 'hi';
  }
}
