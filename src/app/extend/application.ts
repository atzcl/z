/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 拓展 application
|
*/

import { Application } from 'midway';

const modulesSymbol = Symbol('Application#modules');

const extendApplication = {
  /**
   * 创建 modules 对象，并挂载到 app 对象中
   *
   * @returns void
   */
  get modules (): Application {
    if (! this[modulesSymbol]) {
      Object.defineProperty(this, modulesSymbol, {
        value: {
          config: {},
          controller: {},
          middleware: {},
        },
        writable: false,
        configurable: false,
      });
    }

    return this[modulesSymbol];
  },
};

export default extendApplication;
