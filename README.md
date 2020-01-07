# z
> 基于以下技术构建
- Node.js & MidwayJS(EggJS)
- TypeScript
- Redis
- MySQL 5.7 以上
- Sequelize
- <del> TypeORM 底层还在进行大重构，暂时不适宜用于生产环境</del>
- Socket.io
- <del>GraphQL<del>
- ...

## 注意事项
**因为 `midwayjs` 使用了 `IoC` 容器进行依赖解耦，所以开发方式会跟 `eggjs` 有些不一样，建议先阅读 [midwayjs 官方文档](https://midwayjs.org/midway/)、[Injection 文档](https://midwayjs.org/injection/guide.html)**

**验证码模块使用了 `node-canvas` 库, 所以请先根据 [node-canvas 文档](https://github.com/Automattic/node-canvas) 安装好相应的依赖**


## 模块开发目录
开发目录为：`src/app/modules/*`

## 快速开始
> 请确保已经拉取项目到本地环境,并且安装配置好 Node/yarn

**1、安装依赖**
```bash
yarn
```

**2、copy `config` 配置**
```bash
cp src/config/config.example src/config/config.default.ts
```
然后修改对应的配置信息

**3、执行数据库迁移**
>sequelize-cli 的数据库迁移并不好用，主要是它没办法定义多目录的 migration, 所以当前使用的是 typeorm 的数据库迁移功能

>遇到出现 UnhandledPromiseRejectionWarning: QueryRunnerAlreadyReleasedError: Query runner already released. Cannot run queries anymore. 错误，请无需担心，这是 typeorm 的一个 bug, 不会影响迁移结果
```bash
yarn typeorm migration:run
```

**4、运行**
```bash
yarn dev
```

## 部署
> 更多请看 [midway 部署](https://midwayjs.org/midway/guide.html#%E9%83%A8%E7%BD%B2)

**使用 docker**
详见 docker 手册跟 Dockerfile

**使用 pm2**
```bash
pm2 start ecosystem.config.js
```

**使用 egg-scripts**
```bash
yarn start
```

## 辅助开发的 Cli 命令
> 对应代码目录: src/console

```bash
// 待补充
```
