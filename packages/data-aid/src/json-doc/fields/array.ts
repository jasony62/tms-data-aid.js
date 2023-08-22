import { SchemaProp } from '@/json-schema/model'
import { Field, ARRAY_KEYWORDS } from './field'

type Choice = {
  value: string
  label: string
  group?: string
}
/**
 * 字段可用的选项
 * @param choices
 * @returns
 */
export function parseChoices(choices?: Choice[]): Choice[] | undefined {
  return choices?.map((choice) => {
    let obj: Choice = { value: choice.value, label: choice.label }
    if (choice.group) {
      obj.group = choice.group
    }
    return obj
  })
}

export class FieldArray extends Field {
  multiple: boolean
  choices: any[] = []
  itemGroups?

  constructor(prop: SchemaProp, index = -1, name = '') {
    super(prop, index, name)

    const { attrs } = prop
    this.multiple = attrs.type === 'array'

    for (const keyword of ARRAY_KEYWORDS) {
      if (attrs.hasOwnProperty(keyword)) {
        switch (keyword) {
          case 'enum':
            if (!this.type) {
              this.type = 'select'
            }
            if (attrs?.enumGroups?.length) {
              this.itemGroups = attrs.enumGroups
            }
            this.choiceType = 'option'
            this.choices = parseChoices(attrs[keyword]) ?? []
            break

          case 'oneOf':
            this.type = 'radiogroup'
            this.choiceType = 'radio'
            this.value = this.hasOwnProperty('value') ? this.value : ''
            this.choices = parseChoices(attrs[keyword]) ?? []
            break

          case 'anyOf':
            this.type = 'checkboxgroup'
            this.choiceType = 'checkbox'
            this.value = Array.isArray(this.value) ? this.value : []
            this.choices = parseChoices(attrs[keyword]) ?? []
            break
        }
      }
    }
    if (!this.type) {
      this.type = attrs.type
      this.choices = []
    }
  }
}
