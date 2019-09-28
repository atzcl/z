/* eslint-disable @typescript-eslint/no-use-before-define */
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 执行 typeorm 的数据库迁移
*/

import * as process from 'child_process';

import * as yargs from 'yargs';


const MAKE_TYPE = 'migration:revert';
const MAKE_TYPE_NAME = '数据库迁移';

export default class CreateMigrationRevertCommand implements yargs.CommandModule {
  command = `make:${MAKE_TYPE}`;

  // 定义的命令
  describe = `回滚${MAKE_TYPE_NAME}`;

  // 说明
  aliases = 'mi-revert'; // 别名

  // 给当前命令添加额外的设置
  builder(args: yargs.Argv) {
    return args;
  }

  /**
   * 执行业务处理
   *
   * @param args
   */
  async handler() {
    process.exec('yarn typeorm migration:revert', (err, stdout) => {
      // 打印执行结果
      console.log(stdout)
    })
  }
}
