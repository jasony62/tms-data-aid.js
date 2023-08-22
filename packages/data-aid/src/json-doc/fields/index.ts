import { SchemaProp } from '@/json-schema/model'
import { Field, ARRAY_KEYWORDS } from './field'
import { FieldBoolean } from './boolean'
import { FieldText } from './text'
import { FieldArray } from './array'
import { FieldObject } from './object'
// import { FormContext } from '../builder'
type FormContext = { fields: any }
/**
 * 创建表单字段对象
 *
 * @param prop JSONSchema属性
 * @param index 如果字段是数组中的对象的字段，index为字段所属对象在数组中的索引
 */
function createField(
  ctx: FormContext,
  prop: SchemaProp,
  parentField?: Field,
  index = -1,
  name = ''
): Field {
  let newField: Field | undefined

  switch (prop.attrs.type) {
    case 'boolean':
      newField = new FieldBoolean(prop, index, name)
      break
    case 'array':
      newField = ARRAY_KEYWORDS.some((kw) => prop.hasOwnProperty(kw))
        ? new FieldArray(prop, index, name)
        : new FieldObject(prop, index, name)
      break
    case 'object':
      newField = new FieldObject(prop, index, name)
      break
    case 'integer':
    case 'number':
    case 'string':
      for (const keyword of ARRAY_KEYWORDS) {
        if (prop.attrs.hasOwnProperty(keyword)) {
          prop.items = {
            type: prop.attrs.type,
            enum: prop.attrs[keyword],
          }
          newField = new FieldArray(prop, index, name)
          break
        }
      }
      if (!newField) newField = new FieldText(prop, index, name)
      break
    default:
      newField = new FieldText(prop, index, name)
  }

  /**有父字段，可能需要调整名称*/
  if (parentField) {
    newField.path = parentField.fullname
    // 新字段是数组中的项目
    if (prop.name === '[*]') newField.path += '[*]'
  }

  // 不使用重复创建的field，因为计算fullname较为复杂，所以先创建对象再查找，可以优化
  if (ctx.fields) {
    let exist = ctx.fields.get(newField.fullname)
    if (exist) {
      newField = exist
    } else {
      if (parentField && ['object', 'array'].includes(parentField.type))
        parentField.children?.push(newField)
      ctx.fields.set(newField.fullname, newField)
    }
  }

  return newField
}

export {
  createField,
  Field,
  ARRAY_KEYWORDS,
  FieldBoolean,
  FieldText,
  FieldArray,
  FieldObject,
}
