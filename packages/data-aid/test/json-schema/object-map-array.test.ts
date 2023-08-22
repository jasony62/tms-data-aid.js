import { SampleSchema } from '../data/schema-object-map-array'
import { SchemaIter } from '@/json-schema/model'

describe('对象的子属性是数组，数组的项目是对象', () => {
  it('遍历数据', () => {
    const iter = new SchemaIter(SampleSchema)
    const props = Array.from(iter)
    // expect(props).toHaveLength(4)
    // console.log('iter', Array.from(iter))
  })
})
