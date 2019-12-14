/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 简单封装一下生成迁移数据的处理
|
*/

import { QueryRunner, Table, TableIndex } from 'typeorm';

import { ColumnDefinition } from './ColumnDefinition';

/**
 * mysql/mariadb的列类型
 *
 * @see https://typeorm.io/#/entities/mysqlmariadb%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B
 */
export class Blueprint {
  protected tableName: string;

  protected indexName: string[] = [];

  protected TABLE_DEFAULT_INDEX_NAME = 'IDX_DEFAULT_NAME';

  protected queryRunner: QueryRunner;

  protected columns: ColumnDefinition[] = []

  constructor(tableName: string, queryRunner: QueryRunner) {
    this.tableName = tableName;
    this.queryRunner = queryRunner;
  }

  index(value: string | string[]) {
    if (typeof value === 'string') {
      this.indexName.push(value);

      return;
    }

    this.indexName = [...this.indexName, ...value];
  }

  uuid(column: string) {
    return this.addColumn('uuid', column);
  }

  char(column: string, length?: number) {
    if (length) {
      return this.addColumn('char', column).length(length);
    }

    return this.addColumn('char', column);
  }

  string(column: string, length?: number) {
    if (length) {
      return this.addColumn('varchar', column).length(length);
    }

    return this.addColumn('varchar', column);
  }

  json(column: string) {
    return this.addColumn('json', column);
  }

  text(column: string) {
    return this.addColumn('text', column);
  }

  mediumText(column: string) {
    return this.addColumn('mediumtext', column);
  }

  integer(column: string) {
    return this.addColumn('int', column).unsigned();
  }

  bigInteger(column: string) {
    return this.addColumn('bigint', column).unsigned();
  }

  tinyInteger(column: string, length = 1) {
    return this.addColumn('tinyint', column).length(length).unsigned();
  }

  enum(column: string, allowed: string[]) {
    return this.addColumn('enum', column).enum(allowed);
  }

  timestamp(column: string) {
    return this.addColumn('timestamp', column);
  }

  smallUUIDPrimary(column = 'id') {
    return this.smallUUID(column).primary().unique().index();
  }

  smallUUID(column: string) {
    return this.char(column).length(32);
  }

  rememberToken() {
    return this.string('remember_token', 100).nullable();
  }

  timestamps() {
    this.timestamp('created_at').nullable().comment('创建时间');
    this.timestamp('updated_at').nullable().comment('更新时间');
  }

  softDeletes(column = 'deleted_at') {
    this.timestamp(column).nullable().comment('软删除时间');
  }

  userApplicationPlatformId() {
    return this.smallUUID('user_application_platform_id').index().comment('当前所属应用所属平台 id');
  }

  // 快捷添加默认字段
  quicklyAddDefaultFields(centerFn = () => {}) {
    this.smallUUIDPrimary('id');
    // this.userApplicationPlatformId();

    // 加这一个是为了生成的字段顺序好看点
    centerFn();

    this.timestamps();
    this.softDeletes();
  }

  async build(addColumnsClosures: (table: Blueprint) => void) {
    addColumnsClosures(this);

    await this.createTable()

    this.createIndex()
  }

  protected async createTable() {
    if (! this.columns.length) {
      throw new Error('需要创建的字段为空');
    }

    return this.createTableByTypeORM();
  }

  // typeorm 的生成处理
  protected async createTableByTypeORM() {
    const columns = this.columns.map((column) => {
      const newAttributes = {} as any;

      // 为了磨平不同的 orm, ColumnDefinition 的字段属性是统一的
      // 这就需要在生成的时候对照对应的 orm 的 columnOptions 属性名称来还原
      const columnMaps = {
        primary: 'isPrimary',
        unique: 'isUnique',
        nullable: 'isNullable',
      } as any

      const getAttributes = column.getAttributes();

      // 如果不设置为 null 的话，默认就是 not null
      if (! getAttributes.nullable) {
        newAttributes.isNullable = false;
      }

      for (const [k, v] of Object.entries(getAttributes)) {
        if (columnMaps[k]) {
          newAttributes[columnMaps[k]] = v;

          continue;
        }

        // typeorm 的 length 需要为字符串
        if (k === 'length') {
          newAttributes[k] = String(v);

          continue;
        }

        // 索引是需要抽离到单独的数组中去统一创建的，并不属性字段属性
        if (k === 'index') {
          this.index(column.getColumnName());

          continue;
        }

        newAttributes[k] = v;
      }

      return newAttributes
    });

    await this.queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns,
      }),
      true,
    );
  }

  protected createIndex() {
    if (! this.indexName.filter(Boolean).length) {
      return;
    }

    this.queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: this.TABLE_DEFAULT_INDEX_NAME,
        columnNames: this.indexName,
      }),
    );
  }

  protected addColumn(type: string, column: string) {
    const columnDefinition = new ColumnDefinition(column, type);

    this.columns.push(columnDefinition);

    return columnDefinition;
  }
}
