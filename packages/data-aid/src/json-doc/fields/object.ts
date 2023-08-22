import { SchemaProp } from '@/json-schema/model'
import { Field } from './field'

export class FieldObject extends Field {
  multiple: boolean
  itemSchema

  constructor(prop: SchemaProp, index = -1, name = '') {
    super(prop, index, name)
    const { attrs, items } = prop
    this.multiple = attrs.type === 'array'
    this.type = attrs.type
    this.itemSchema = items

    /**设置默认值*/
    if (attrs.type === 'array') {
      this.value = Array.isArray(this.value) ? this.value : []
    } else if (attrs.type === 'object') {
      this.value = this.value ? this.value : {}
    }
  }
}
