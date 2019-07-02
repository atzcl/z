/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| typeorm 自定义日志
|
| @see https://typeorm.io/#/logging/%E4%BD%BF%E7%94%A8%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AE%B0%E5%BD%95%E5%99%A8
*/

import { EggLogger } from 'midway';
import { Logger, QueryRunner } from 'typeorm';

export class TypeORMLogger implements Logger {
  logger: EggLogger;

  constructor(logger: EggLogger) {
    this.logger = logger;
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    console.log(this.logger);
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    //
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    //
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    //
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    //
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    //
  }
}
