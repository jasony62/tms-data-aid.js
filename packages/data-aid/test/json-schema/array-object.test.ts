import { SampleSchema } from '../data/schema-array-object'
import { JSONSchemaBuilder } from '@/json-schema/builder'

describe('处理JSONSchema', () => {
  it('迭代JSONSchema属性', () => {
    const builder = new JSONSchemaBuilder()
    builder.flatten(SampleSchema)
    const expectNames = [
      '',
      'experiences',
      'experiences[*].time',
      'experiences[*].content',
    ]
    expect(builder.fullnames()).toEqual(expectNames)
    // console.log(builder.props)
  })
})
