/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义 console command 工具类
|
*/

import * as path from 'path';

import chalk from 'chalk';
import * as ejs from 'ejs';
import * as plural from 'plural';
import { camelCase, upperFirst } from 'lodash';

/**
 * 统一输出 log
 *
 * @param message
 */
export const echoMessage = (message: string) => {
  console.log();
  console.log(message);
  console.log();
};

/**
 * 抛出异常信息
 *
 * @param {string} message
 */
export const abort = (message: string, code?: number) => {
  echoMessage(`${chalk.red('😣 ')}${chalk.red(message)}`);

  // 中断后续执行
  process.exit(code);
};

/**
 * 打印成功信息
 *
 * @param {string} message
 * @param {string} desc 描述
 */
export const success = (message: string, desc = '') => {
  echoMessage(chalk.green(`✔ ${desc} ${chalk.green.bold(message)}`));
};

/**
 * 打印文件创建成功信息
 *
 * @param {string} message
 */
export const makeFileSuccess = (message: string) => {
  success(message, '创建成功: ');
};

/**
 * 打印目录创建成功信息
 *
 * @param {string} message
 */
export const makeDirSuccess = (message: string) => {
  console.log(`${chalk.green('✔ ')}${chalk.grey(`创建目录: ${chalk.grey.bold(message)}`)}`);
};

/**
 * 项目根目录，跟随调用目录而变
 */
export const getRootPath = () => path.resolve(__dirname, '../../../');

/**
 * 跟项目根目录进行指定路径拼接
 *
 * @param {string} pathName
 *
 * @returns {string}
 */
export const getRootPathResolve = (pathName: string) => path.resolve(getRootPath(), pathName);

/**
 * 项目 src 目录
 */
export const getSrcPathResolve = (pathName?: string) => getRootPathResolve(`src${pathName ? `/${pathName}` : ''}`);

/**
 * 简单的路径拼接生成
 *
 * @param {string} root 主路径
 * @param {string} to 目录路径
 *
 * @returns {string}
 */
export const resolve = (root: string, to: string): string => path.resolve(root, to);

/**
 * 简单判断非空
 *
 * @param {object} value 判断的数据
 */
export const notEmpty = (value: object) => {
  const keys = Object.keys(value);

  for (const [k, v] of Object.entries(keys)) {
    if (! v) {
      abort(`${k} 不能为空`);
      break;
    }
  }
};

/**
 * 模板渲染
 *
 * @param {string} templateString 模板内容
 * @param {object} options 模板渲染数据
 *
 * @returns {string}
 */
export const templateCompile = (templateString: string, options: object) => ejs.render(templateString, options);

/**
 * 转换为大驼峰写法
 *
 * @param {string} name 转换的名称
 *
 * @returns {string}
 */
export const studlyCase = (name: string) => upperFirst(camelCase(name));

export {
  plural,
  upperFirst,
  camelCase,
};
