import { SampleSchema } from '../data/schema-array-object-pattern'
import { JSONSchemaBuilder } from '@/json-schema/builder'

describe('处理JSONSchema', () => {
  it('迭代JSONSchema属性', () => {
    const builder = new JSONSchemaBuilder()
    builder.flatten(SampleSchema)
    const expectNames = [
      '',
      'experiences',
      'experiences[*].^time$',
      'experiences[*].^content$',
    ]
    expect(builder.fullnames()).toEqual(expectNames)
    expect(builder.props[1]).toHaveProperty('patternChildren')
    expect(builder.props[1].patternChildren).toHaveLength(2)
    expect(builder.props[2].isPattern).toBeTruthy()
    expect(builder.props[3].isPattern).toBeTruthy()
    // console.log(builder.fullnames())
    // console.log(builder.props)
  })
})
