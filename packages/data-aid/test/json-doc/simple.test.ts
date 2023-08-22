import { SampleSchema } from '../data/schema-simple'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('简单定义生成表单节点', () => {
  it('构造表单节点', () => {
    const editDoc = new DocAsArray({})
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
    // console.log(fieldNames)
    expect(fieldNames).toHaveLength(5)
    expect(fieldNames[0]).toBe('name')
    expect(fieldNames[1]).toBe('agree')
    expect(fieldNames[2]).toBe('tel.areaCode')
    expect(fieldNames[3]).toBe('tel.phoneNumber')
    expect(fieldNames[4]).toBe('tel')
  })
})
