import { Application } from 'midway';

// import loader from '@my_foundation/libs/loader';

export default (app: Application) => {
  /**
   * 加载自定义 Loader
   *
   * @description midway 1.4.2, @controller 装饰器可以无视目标目录是否合法，所以无需再自己 loader 多模块目录下的 Controller 文件了
   */
  // loader(app);

  app.beforeStart(async () => {
    // 提前创建 typeorm 链接
    // await app.applicationContext.getAsync('typeormSingleton');

    // 提前创建 sequelize 链接
    await app.applicationContext.getAsync('sequelizeSingleton');
    // 创建微信相关服务
    await app.applicationContext.getAsync('wechat');

    // 启动队列
    // await app.applicationContext.getAsync('queue')
  });
};
