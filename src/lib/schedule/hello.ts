import { provide, schedule } from 'midway';

@provide()
@schedule({
  interval: 2333, // 2.333s 间隔
  type: 'worker', // 指定某一个 worker 执行
  immediate: false, // 配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务
  disable: true, // 配置该参数为 true 时，这个定时任务不会被启动
})
export class HelloCron {
  // 定时执行的具体任务
  async exec(ctx) {
    ctx.logger.info(process.pid, 'hello');
    // (this as any).closed = true;
  }
}
