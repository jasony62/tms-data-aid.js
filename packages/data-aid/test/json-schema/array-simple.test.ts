import { SampleSchema } from '../data/schema-array-simple'
import { SchemaIter } from '@/json-schema/model'

describe('处理JSONSchema', () => {
  it('迭代JSONSchema属性', () => {
    const iter = new SchemaIter(SampleSchema)
    const props = Array.from(iter)
    expect(props).toHaveLength(2)
    // console.log('iter', Array.from(iter))
  })
})
