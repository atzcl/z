# z
> 基于以下技术构建

- Node.js & EggJS
- TypeScript
- Redis
- MySQL 5.7 以上
- Sequelize
- Socket.io
- GraphQL
- ...

## 快速开始
> 请确保已经拉取项目到本地环境,并且安装配置好 Node/yarn

**1、安装依赖**
```bash
yarn install
```

**2、根据需要更改 config 信息**
```bash
// config.default.ts
```

**3、执行数据库迁移**
>因为 egg-sequelize 并不读取 .ts 的配置文件，所以在执行迁移命令的时候会报错，另：又因为 egg-ts-helper 在开发期内，会自动清除命名一致的 .js 的配置文件，所以当你在执行迁移命令之前，先把 config.default.ts.bak 文件的 .bak 去掉
```bash
yarn migrate:up
```

**4、运行**
```bash
yarn dev
```
