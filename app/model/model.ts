import { Application } from 'egg';
import { snakeCase } from 'lodash';
import * as moment from 'moment';
import { DefineAttributes, SequelizeStatic } from 'sequelize';

/**
 * 模型基类，可以在这里定义全局使用的作用域、hook、必要的字段定义
 *
 * @param {object} app 传入的 egg 的 Application 对象
 * @param {string} table 表名
 * @param {object | string} attributes 定义表的字段数据
 * @param {object} options 模型的相关配置
 */
export default function BaseModel (
  app: Application,
  table: string,
  attributes: DefineAttributes,
  options: object = {},
) {
  const { Op, UUID, UUIDV4 } = app.Sequelize;

  // 设置默认数据
  const modelSchema = app.model.define(table, {
    id: {
      type: UUID, // UUID : mysql --- >chat(36); PostgreSQL --- > UUID
      unique: true, // 唯一索引
      primaryKey: true, // 主键
      allowNull: false,
      defaultValue: UUIDV4, // Sequelize 自动生成 v4 UUID
    },
    ...attributes,
    ...getDefaultAttributes(options, app.Sequelize),
  }, {
    // 自动维护时间戳 [ created_at、updated_at ]
    timestamps: true,
    // 不使用驼峰样式自动添加属性，而是下划线样式 [ createdAt => created_at ]
    underscored: true,
    // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
    // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
    freezeTableName: false,
    ...options,
    scopes: {
      // 定义全局作用域，使用方法如: .scope('onlyTrashed') or .scope('onlyTrashed1', 'onlyTrashed12') [ 多个作用域 ]
      onlyTrashed: {
        // 只查询软删除数据
        where: {
          deleted_at: {
            [Op.not]: null,
          },
        },
      },
    },
  });

  /**
   * @returns {string[]} 获取定义的所有字段属性
   */
  modelSchema.getAttributes = (): string[] => {
    return Object.keys(attributes);
  };

  /**
   * @returns {string} 获取定义的指定字段属性的值
   */
  modelSchema.findAttribute = (attribute: string): object | undefined => {
    return (attributes as any)[attribute];
  };

  /**
   * @returns {array} 可批量赋值的数组,当为空时，会自动遍历 model 定义的字段属性来进行过滤
   */
  modelSchema.fillable = (): string[] => {
    return [];
  };

  /**
   * @returns {array} 输出数据时，隐藏字段数组 [ 黑名单 ]
   */
  modelSchema.hidden = (): string[] => {
    return [];
  };

  /**
   * @returns {array} 输出数据时显示的属性 [ 白名单 ]
   */
  modelSchema.visible = (): string[] => {
    return [];
  };

  return modelSchema;
}

/**
 * 获取经过过滤的预设共用的字段属性
 *
 * @param options sequelize 的 define 的 options 参数
 * @param sequelize sequelize 的 SequelizeStatic 对象
 * @returns {object}
 */
function getDefaultAttributes (options: object, sequelize: SequelizeStatic): object {
  const { DATE } = sequelize;

  // 预设共用的默认字段属性
  const defaultAttributes = {
    created_at: {
      type: DATE,
      get () {
        return moment((this as any).getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updated_at: {
      type: DATE,
      get () {
        return moment((this as any).getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  };

  // 需要从 options 读取的配置信息，用于下方做过滤的条件
  const attributes = [ 'createdAt', 'updatedAt', 'deletedAt' ];

  // 遍历传入的属性是否符合过滤条件
  Object.keys(options).forEach((value: string) => {
    // 判断是否存在过滤条件、设置的属性是否为关闭 [false]
    // 比如关闭了 updatedAt 的自动维护更新，那么就应该把预设 updated_at 给过滤掉，不然在查询的时候，依然会带上该条件
    if (attributes.includes(value) && (options as any)[value] === false) {
      // 删除该预设字段
      delete (defaultAttributes as any)[snakeCase(value)];
    }
  });

  return defaultAttributes || {};
}
