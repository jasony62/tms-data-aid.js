# 根节点

根节点的名称不允许修改

根节点不允许删除

# 属性节点

## 基础字段

名称不允许为空

## 子属性

属性的类型为`object`，有子属性时，不允许修改属性的类型。

属性的类型为`object`，支持`properties`和`patternProperties`。

只有属性的类型为`array`，才会出现设置【子对象格式】。

属性的类型为`array`，必须包含`items`字段，默认的`type`为`string`。

属性的类型为`array`，子对象类型为`object`，有子属性时，不允许修改属性的类型。

属性的类型为`array`，子对象类型不可以为`array`。

属性的类型为`array`，子对象类型不是`object`，不允许添加属性。

## 支持选项

属性的类型为`integer`、`number`、`string`、`array`，出现设置【设置选项】。

【设置选项】要支持`enum`，`oneOf`和`anyOf`几种情况。

enum

anyOf

oneOf

## 默认值

如何实现数组类型的默认值？

# 公共问题

报错的显示方式

支持按规范的`required`指定方式和在属性上直接指定的方式。

添加节点的位置

# 属性依赖

# 获取外部数据

# 支持重用

# 节点类名称

分为 3 个部分。属性列表。一级字段编辑。二级字段编辑。

`properties`

`property`

`property-fields`

`field`

# 类

JSONSchemaBuilder

用一维数组结构存储有层级关系的`JSONSchema`，通过`flatten`和`unflatten`实现对象和数组之间的转换。

# 备忘

修改属性类型

改变属性顺序

必填项

支持根据默认值的类型自动推导`type`

设置范围

文件类型

通过 API 动态获取数据

日期数据

移动端自适应

替换组件的机制（将表现和逻辑分离）

允许通过属性指定提示信息的展示方法。
