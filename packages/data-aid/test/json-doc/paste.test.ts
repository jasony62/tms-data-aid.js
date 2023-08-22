import { SampleSchema, SampleData, SamplePasted } from '../data/paste'
import { DocAsArray } from '@/json-doc/model'

describe('测试粘贴数据，set方法', () => {
  it('粘贴根数据', () => {
    const editDoc = new DocAsArray(SampleData)
    console.log(JSON.stringify(editDoc.build(SampleSchema, true), null, 2))
    console.log(editDoc._properties)
    editDoc.set('', SamplePasted)
    console.log(JSON.stringify(editDoc.build(SampleSchema, true), null, 2))
    console.log(editDoc._properties)
  })
})
