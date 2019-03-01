/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 自定义 console command 的全局配置
|
*/

export interface IConfig {
  appPath: string;
  modulePath: string;
  templateRootPath: string;
}

let commandConfig: any = {};
export const getCommandConfig = (): IConfig => commandConfig;
export const setCommandConfig = (config: any) => commandConfig = config;
