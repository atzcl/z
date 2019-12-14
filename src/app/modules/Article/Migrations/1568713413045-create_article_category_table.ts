/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| categories
|
*/

import { MigrationInterface, QueryRunner } from 'typeorm';
import { Blueprint } from '@app/foundations/Migrations/Blueprint';

import { DEFAULT_STATUS } from '@/app/constants/Global';

// 表名
const TABLE_NAME = 'article_categories';

export class ArticleCategory1568713413049 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    await (new Blueprint(TABLE_NAME, queryRunner))
      .build((table) => {
        table.quicklyAddDefaultFields(() => {
          table.smallUUID('parent_id').default('root').index().comment('父级 id');

          table.string('name').comment('名称').index();

          table.string('description').nullable().comment('名称');
          table.string('route').nullable().comment('路由链接');
          table.string('image').nullable().comment('缩略图');

          table.string('seo_title').nullable().comment('seo 标题');
          table.string('seo_keywords').nullable().comment('seo 关键词');
          table.string('seo_description').nullable().comment('seo 描述');

          table.integer('order').default(0).comment('排序');
          table.tinyInteger('status').default(DEFAULT_STATUS.NORMAL).comment('状态：1 正常，其他： 异常');
        })
      });
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
