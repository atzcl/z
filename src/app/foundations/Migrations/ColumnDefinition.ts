/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 链式设置数据字段的属性
|
*/

type ColumnDefinitionAttribute = 'name' | 'type' | 'length'
| 'primary' | 'unique' | 'unsigned'
| 'index' | 'default' | 'nullable'
| 'comment' | 'enum';
type ColumnDefinitionAttributeValue = number | string | boolean | string[] | null;

export class ColumnDefinition {
  attributes: {[k in ColumnDefinitionAttribute]: ColumnDefinitionAttributeValue } = {} as any;

  constructor(name: string, type: string) {
    this.setAttributes('name', name)
    this.setAttributes('type', type)
  }

  length(value: number) {
    return this.setAttributes('length', value);
  }

  primary() {
    return this.setAttributes('primary', true);
  }

  unique() {
    return this.setAttributes('unique', true);
  }

  unsigned() {
    return this.setAttributes('unsigned', true);
  }

  default(value?: string | number) {
    return this.setAttributes('default', (value !== undefined && `"${value}"`) || null)
  }

  index() {
    return this.setAttributes('index', true)
  }

  nullable() {
    return this.setAttributes('nullable', true)
  }

  comment(value: string) {
    return this.setAttributes('comment', value)
  }

  enum(value: string[]) {
    return this.setAttributes('enum', value)
  }

  getColumnName() {
    return String(this.attributes.name || '');
  }

  getAttributes() {
    return this.attributes;
  }

  protected setAttributes(attribute: ColumnDefinitionAttribute, value: ColumnDefinitionAttributeValue) {
    this.attributes[attribute] = value;

    return this;
  }
}
