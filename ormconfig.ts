/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| typeorm cli config
|
*/

import { customizeConfig } from './src/config/config.default';


const dbConfig = customizeConfig.sequelize;

const typeormConfig = {
  type: dbConfig.dialect,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  timezone: dbConfig.timezone,
  logging: true,
  charset: 'UTF8MB4_UNICODE_CI',
  entities: ['src/app/modules/**/Models/*{.ts,.js}'],
  migrations: ['src/app/modules/**/Migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migration',
  },
};

export = typeormConfig;
