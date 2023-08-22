import { SampleSchema } from '../data/schema-object-map'
import { SchemaIter } from '@/json-schema/model'
import { JSONSchemaBuilder } from '@/json-schema/builder'

describe('处理动态添加对象子属性的定义', () => {
  it('迭代JSONSchema属性', () => {
    const iter = new SchemaIter(SampleSchema)
    const props = Array.from(iter)
    // console.log('props', props)
    expect(props).toHaveLength(10)
  })
})

describe('处理 patternProperties JSONSchema', () => {
  it('基本处理', () => {
    const iter = new SchemaIter(SampleSchema)
    const props = Array.from(iter)
    const builder = new JSONSchemaBuilder()
    builder.props = props
    const result = builder.unflatten()
    // // console.log('properties', result.properties.org.properties)
    // console.log('pptterperties', result.properties.org.patternProperties)
  })
})
