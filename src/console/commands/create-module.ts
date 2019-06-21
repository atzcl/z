/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 创建一个模块
*/

import * as yargs from 'yargs';
import * as fs from 'fs-extra';

import { getCommandConfig } from '@my_console/utils/config';
import { resolve, abort, makeDirSuccess } from '@my_console/utils';

import { createHandler as createControllerHandler } from './create-controller';

const MAKE_TYPE_NAME = '模块';
const MAKE_TYPE_EXTNAME = 'ts';

export default class CreateControllerCommand implements yargs.CommandModule {
  command = 'make:module'; // 定义的命令
  describe = `生成${MAKE_TYPE_NAME}`; // 说明
  aliases = 'mm'; // 别名

  /**
   * 执行业务处理
   *
   * @param args
   */
  async handler(args: yargs.Arguments) {
    const moduleName = args._[1];
    if (! moduleName) {
      abort('请输入创建的模块名称');
    }

    // 获取全局配置
    const config = getCommandConfig();

    // 构成当前需要创建的模块路径
    const currentModulePath = resolve(config.modulePath, moduleName);
    if (fs.existsSync(currentModulePath)) {
      abort(`${moduleName} 模块已存在，请更换模块名称`);
    }

    // todo: 如果后面要抽离为单独的 cli 工具，那么这部分可以放到 config 里面去
    const needCreateDirs = {
      module: {},
      Controllers: {
        initFile: createControllerHandler, // 创建默认模块
      },
      Models: {},
      Services: {},
      Validates: {},
      // Configs: {},
      Middlewares: {},
      // Resources: {},
      Migrations: {},
    };

    // 创建目录
    Object.keys(needCreateDirs).forEach((attr: keyof typeof needCreateDirs) => {
      // 为了方便，创建模块根目录的处理也放在一起了
      const isModule = attr === 'module';

      fs.emptyDir(resolve(config.modulePath, `${moduleName}${isModule ? '' : `/${attr}`}`))
        .then(() => {
          // 如果是创建模块根目录，那么就无需处理后续逻辑
          if (isModule) {
            return;
          }

          // 输出创建目录成功信息
          makeDirSuccess(attr);

          // 执行目录创建成功后，对应的相关处理
          const value = needCreateDirs[attr];
          // 生成的文件目录
          const filePath = resolve(currentModulePath, `${attr}/${moduleName}.${MAKE_TYPE_EXTNAME}`);
          // 调用的模板根目录
          const templateRootPath = config.templateRootPath;

          // 生成初始文件
          if ((value as any).initFile && typeof (value as any).initFile === 'function') {
            (value as any).initFile(moduleName, moduleName, filePath, templateRootPath);
          }
        });
    });
  }
}
