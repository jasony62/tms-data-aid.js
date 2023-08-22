import { SampleSchema } from '../data/rcscarousel'
import { SchemaIter } from '@/json-schema/model'

describe('处理JSONSchema', () => {
  it('迭代JSONSchema属性', () => {
    // console.log(JSON.stringify(SampleSchema, null, 2))
    const iter = new SchemaIter(SampleSchema)
    // console.log('iter', Array.from(iter))
  })
})
