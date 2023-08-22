import { SampleSchema } from '../data/schema-prop-oneof'
import { JSONSchemaBuilder } from '@/json-schema/builder'

describe('处理oneOf属性', () => {
  it('oneOf属性', () => {
    const builder = new JSONSchemaBuilder()
    builder.flatten(SampleSchema)
    // console.log(builder.props)
  })
})
