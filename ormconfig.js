// 为了能使用 typeorm 的 cli
module.exports = {
  "type": "mysql",
  "host": "127.0.0.1",
  "port": 3306,
  "username": "root",
  "password": "root",
  "database": "s",
  "charset": "UTF8MB4_UNICODE_CI",
  "logging": true,
  "timezone": "+08:00",
  "entities": [ "src/app/modules/**/models/*{.ts,.js}" ],
  "migrations": [ "src/app/modules/**/migrations/*{.ts,.js}" ],
  "cli": {
    "migrationsDir": "src/migration"
  }
};
