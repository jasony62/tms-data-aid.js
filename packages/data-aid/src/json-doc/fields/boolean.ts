import { SchemaProp } from '@/json-schema/model'
import { Field } from './field'

export class FieldBoolean extends Field {
  constructor(prop: SchemaProp, index = -1, name = '') {
    super(prop, index, name)
    this.type = 'checkbox'
  }
}
