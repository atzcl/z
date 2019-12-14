/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| user_admins
|
*/

import { MigrationInterface, QueryRunner } from 'typeorm';
import { Blueprint } from '@app/foundations/Migrations/Blueprint';

import { DEFAULT_STATUS } from '@/app/constants/Global';

// 表名
const TABLE_NAME = 'user_admins';

export class CreateUserAdminsTable1550642878333 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    await (new Blueprint(TABLE_NAME, queryRunner))
      .build((table) => {
        table.quicklyAddDefaultFields(() => {
          table.char('username', 64).unique().comment('用户名').index();
          table.char('email', 150).unique().nullable().comment('邮箱');
          table.char('phone', 20).unique().nullable().comment('手机号码');

          table.string('password').comment('密码');

          table.string('name', 20).nullable().comment('真实姓名');
          table.string('nickname', 100).nullable().comment('昵称');
          table.string('avatar').nullable().comment('用户头像');

          table.string('bio').nullable().comment('用户简介');
          table.tinyInteger('sex').default(1).comment('用户性别');
          table.string('location').nullable().comment('用户位置');

          table.timestamp('birthdate').nullable().comment('出生日期');
          table.timestamp('email_verified_at').nullable().comment('邮件验证时间');
          table.timestamp('phone_verified_at').nullable().comment('手机验证时间');

          table.integer('user_level_id').nullable().comment('用户等级');

          table.tinyInteger('status').default(DEFAULT_STATUS.NORMAL).comment('状态：1 正常，其他： 异常');

          table.tinyInteger('online_status').default(DEFAULT_STATUS.NORMAL).comment('在线状态：1 正常，其他： 异常');

          table.string('user_token', 500).nullable().comment('用户 token');
        })
      });
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
