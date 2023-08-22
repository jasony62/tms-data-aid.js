import { SampleSchema } from '../data/schema-autofill'
import { SchemaIter } from '@/json-schema/model'

describe('处理JSONSchema', () => {
  it('迭代JSONSchema属性', () => {
    const iter = new SchemaIter(SampleSchema)
    const props = Array.from(iter)
    // console.log('props', JSON.stringify(props, null, 2))
    expect(props).toHaveLength(4)
  })
})
