import { SchemaProp } from '@/json-schema/model'
import { Field } from './field'

/**
 * number,integer,string
 */
export class FieldText extends Field {
  minlength?: number
  maxlength?: number
  pattern?: string

  constructor(prop: SchemaProp, index = -1, name = '') {
    super(prop, index, name)
    const { attrs } = prop
    /*确定字段的类型*/
    if (attrs.format) {
      switch (attrs.format) {
        case 'email':
          this.type = 'email'
          break
        case 'password':
          this.type = 'password'
          break
        case 'uri':
          this.type = 'url'
          break
        case 'regex':
          this.type = 'text'
          // this.pattern = attrs.pattern
          break
        case 'dateTime':
          this.type = 'dateTime'
          break
        case 'longtext':
        case 'mustache':
        case 'handlebars':
          this.type = 'textarea'
          break
      }
    } else {
      switch (attrs.type) {
        case 'number':
        case 'integer':
          this.type = 'number'
          break
        case 'json':
          this.type = 'textarea'
          break
        default:
          this.type = 'text'
      }
    }

    // if (attrs.minLength) {
    //   this.minlength = attrs.minLength
    // }

    // if (attrs.maxLength) {
    //   this.maxlength = attrs.maxLength
    // }
  }
}
