# z
> 基于以下技术构建

- Node.js & EggJS
- TypeScript
- Redis 4
- MySQL 5.7 以上
- Sequelize
- Socket.io
- GraphQL API
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
```bash
yarn migrate:up
```

**4、运行**
```bash
yarn dev
```