import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

import uuidPrimary from '@/app/foundation/Migrations/UuidPrimary';
import timestamps from '@/app/foundation/Migrations/Timestamps';
import softDeletes from '@/app/foundation/Migrations/SoftDeletes';

// 表名
const TABLE_NAME = 'user_admins';
// 索引
const TABLE_DEFAULT_INDEX_NAME = 'IDX_DEFAULT_NAME';

export class CreateUserAdminsTable1550642878333 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(
      new Table({
        name: TABLE_NAME,
        columns: [
          ...uuidPrimary,

          { name: 'username', type: 'varchar', length: '64', isUnique: true, isNullable: true, default: null,
          },
          { name: 'email', type: 'varchar', length: '150', isUnique: true, isNullable: true, default: null,
          },
          { name: 'phone', type: 'varchar', length: '50', isUnique: true, isNullable: true, default: null,
          },

          { name: 'password', type: 'varchar' },

          { name: 'name', type: 'varchar', length: '50', isNullable: true, comment: '真实姓名',
          },
          { name: 'nickname', type: 'varchar', length: '100', isNullable: true, comment: '昵称',
          },
          { name: 'avatar', type: 'varchar', isNullable: true, comment: '用户头像',
          },
          { name: 'bio', type: 'varchar', isNullable: true, comment: '用户简介',
          },
          { name: 'sex', type: 'tinyint', length: '1', default: 0, comment: '用户性别',
          },
          { name: 'location', type: 'varchar', isNullable: true, comment: '用户位置',
          },
          { name: 'birthdate', type: 'timestamp', isNullable: true, comment: '出生日期',
          },

          { name: 'email_verified_at', type: 'timestamp', isNullable: true, comment: '邮件验证时间',
          },
          { name: 'phone_verified_at', type: 'timestamp', isNullable: true, comment: '手机验证时间',
          },

          { name: 'user_level_id', type: 'int', isNullable: true, comment: '用户等级',
          },

          { name: 'status', type: 'tinyint', length: '1', default: 1, comment: '用户状态：1 正常，其他： 异常',
          },
          { name: 'online_status', type: 'tinyint', length: '1', default: 1, comment: '在线状态',
          },

          { name: 'user_token', type: 'text', isNullable: true, comment: '用户 token',
          },

          ...timestamps,
          ...softDeletes,
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      TABLE_NAME,
      new TableIndex({
        name: TABLE_DEFAULT_INDEX_NAME,
        columnNames: [ 'id' ],
      }),
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
