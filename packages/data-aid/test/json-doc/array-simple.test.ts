import { SampleSchema } from '../data/schema-array-simple'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('定义包含数组，数组中项目为简单类型，生成表单节点', () => {
  it('生成表单节点', () => {
    const editDoc = new DocAsArray({ additionalName: ['alice', 'bob'] })
    const fieldNames: string[] = []
    build(
      {
        schema: SampleSchema,
        editDoc,
        onMessage: (msg: string) => {
          console.log(msg)
        },
      },
      fieldNames
    )
    expect(fieldNames).toHaveLength(3)
    let i = 0
    expect(fieldNames[i++]).toBe('additionalName[0]')
    expect(fieldNames[i++]).toBe('additionalName[1]')
    expect(fieldNames[i++]).toBe('additionalName')
  })
})
