#!/usr/bin/env node

/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义 cli 命令入口
|
*/

import * as yargs from 'yargs';

import { abort, getRootPath, getSrcPathResolve } from './utils';
import { setCommandConfig } from './utils/config';
import CreateModule from './commands/create-module';
import CreateController from './commands/create-controller';
import CreateService from './commands/create-service';
import CreateMigration from './commands/create-migration';
import CreateMigrationRunCommand from './commands/create-migration-run';
import CreateMigrationRevertCommand from './commands/create-migration-revert';
import CreateModelCommand from './commands/create-model';


const rootPath = getRootPath();
const srcPath = getSrcPathResolve();
const appPath = getSrcPathResolve('app');
const modulePath = getSrcPathResolve('app/modules');
const templateRootPath = getSrcPathResolve('console/commands/templates');

// 设置全局配置
setCommandConfig({
  rootPath,
  srcPath,
  appPath,
  modulePath,
  templateRootPath,
});

yargs
  .usage('使用方式: <command> [options]')
  .command(new CreateModule())
  .command(new CreateController())
  .command(new CreateService())
  .command(new CreateModelCommand())
  .command(new CreateMigration())
  .command(new CreateMigrationRunCommand())
  .command(new CreateMigrationRevertCommand())
  .recommendCommands()
  .demandCommand(1)
  .strict()
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .locale('zh_CN')
  .fail((msg, err) => {
    // 如果是有异常，那么就保留对应的错误堆栈信息
    if (err) {
      throw err
    }

    // 因为 Midway 采用了自动扫描装配，所以这里要判断一下是否是因为 Midway 的自动扫描触发的错误
    if (msg.includes('framework') && msg.includes('midway')) {
      return;
    }

    // 抛出异常提示
    abort(msg);
  })
  .argv;

// 定义 yargs 的输出样式
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('yargonaut')
  .style('blue')
  .style('yellow', 'required')
  .helpStyle('green')
  .errorsStyle('red');
