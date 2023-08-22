import { SampleSchema } from '../data/schema-defval'
import { SchemaProp } from '@/json-schema/model'
import { JSONSchemaBuilder } from '@/json-schema/builder'

describe('处理JSONSchema - 默认值', () => {
  it('对象的子属性有默认值时，设置父属性的默认值', () => {
    const builder = new JSONSchemaBuilder()
    builder.flatten(SampleSchema)
    expect(builder.fullnames()).toEqual([
      '',
      'generalPurposeCard',
      'generalPurposeCard.layout',
      'generalPurposeCard.layout.cardOrientation',
      'generalPurposeCard.layout.imageAlignment',
      'generalPurposeCard.layout.style',
    ])
    const cardProp = builder.get('generalPurposeCard')
    expect(cardProp).toBeInstanceOf(SchemaProp)
    expect(cardProp?.attrs.default).toMatchObject({
      layout: {
        cardOrientation: 'HORIZONTAL',
        imageAlignment: 'LEFT',
      },
    })
    const layoutProp = builder.get('generalPurposeCard.layout')
    expect(layoutProp).toBeInstanceOf(SchemaProp)
    expect(layoutProp?.attrs.default).toMatchObject({
      cardOrientation: 'HORIZONTAL',
      imageAlignment: 'LEFT',
    })
  })
})
