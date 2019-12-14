/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| articles
|
*/

import { MigrationInterface, QueryRunner } from 'typeorm';
import { Blueprint } from '@app/foundations/Migrations/Blueprint';

import { DEFAULT_STATUS } from '@/app/constants/Global';

// 表名
const TABLE_NAME = 'articles';

export class Article1568714011055 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    await (new Blueprint(TABLE_NAME, queryRunner))
      .build((table) => {
        table.quicklyAddDefaultFields(() => {
          table.string('title').comment('标题').index();
          table.smallUUID('article_category_id').index().comment('所属分类 id');

          table.string('description').nullable().comment('文章摘要');
          table.string('slug').nullable().comment('用于 seo url 优化');
          table.string('author').nullable().comment('作者');
          table.string('source').nullable().comment('来源');

          table.string('image').nullable().comment('缩略图');
          table.json('images').nullable().comment('多图');

          // 当前先统一放到这里来, 后面再优化分离到副表去
          table.mediumText('body').nullable().comment('文章内容');

          table.integer('real_view_count').default(0).comment('查看总数, 真实的');
          table.integer('view_count').default(0)
            .comment('查看总数, 可自定义, 在界面上显示的是 view_count + real_view_count');

          table.integer('reply_count').default(0).comment('回复总数');
          table.smallUUID('last_reply_user_id').nullable().comment('最后回复的用户 id');

          table.string('seo_title').nullable().comment('seo 标题');
          table.string('seo_keywords').nullable().comment('seo 关键词');
          table.string('seo_description').nullable().comment('seo 描述');

          table.tinyInteger('is_top').default(DEFAULT_STATUS.DISABLE).comment('状态：1 置顶，其他');
          table.tinyInteger('is_hot').default(DEFAULT_STATUS.DISABLE).comment('状态：1 热门，其他');

          table.integer('order').default(0).comment('排序');
          table.tinyInteger('status').default(DEFAULT_STATUS.NORMAL).comment('状态：1 正常，其他： 异常');

          table.timestamp('timed_release').nullable().comment('定时发布');
        })
      });
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(TABLE_NAME);
  }
}
