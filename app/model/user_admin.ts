import { Application } from 'egg';
import BaseModel from './model';

export default function UserAdmin (app: Application) {
  const { STRING, BOOLEAN } = app.Sequelize;

  // 创建模型
  const modelSchema = BaseModel(app, 'user_admins', {
    name: { type: STRING(32), unique: true, allowNull: false, comment: '用户名' },
    email: { type: STRING(64), unique: true, allowNull: true, comment: '邮箱地址' },
    phone: { type: STRING(20), unique: true, allowNull: true, comment: '手机号码' },
    status: { type: BOOLEAN, allowNull: false, defaultValue: 1, comment: '用户状态: 1 正常； 0 禁用' },
    password: { type: STRING(255), allowNull: false, comment: '密码' },
  }, {
    // 开启软删除
    paranoid: true,
  });

  /**
   * @returns {array} 可批量赋值的数组,当为空时，会自动遍历 model 定义的字段属性来进行过滤
   */
  modelSchema.fillable = (): string[] => {
    return [
      'name',
      'email',
      'phone',
      'password',
    ];
  };

  /**
   * @returns {array} 输出数据时显示的属性 [ 白名单 ]
   */
  modelSchema.visible = (): string[] => {
    return [
      'id',
      'name',
    ];
  };

  /**
   * @returns {array} 输出数据时，隐藏字段数组 [ 黑名单 ]
   */
  modelSchema.hidden = (): string[] => {
    return [
      'password',
    ];
  };

  // 监听 Sequelize 的创建之前的 hook 钩子行为 [ 即事件 ]
  modelSchema.beforeCreate(async (columns: any) => {
    // 加密密码 [ 或者可以使用 set 修改器来执行该业务 ]
    columns.password = await app.createBcrypt(columns.password);
  });

  return modelSchema;
}
