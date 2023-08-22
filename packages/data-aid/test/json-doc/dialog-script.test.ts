import { SampleSchema, SampleData } from '../data/dialog-script'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('简单定义生成表单节点', () => {
  it('构造表单节点', () => {
    const editDoc = new DocAsArray(SampleData)
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
    // editDoc.appendAt(
    //   'data.before',
    //   { handler: { name: 'GenericAPIHandler' } },
    //   'xyz'
    // )
    // console.log(JSON.stringify(editDoc.properties, null, 2))
    // editDoc.rename('data.before.xyz', 'xyz1')
    // console.log(JSON.stringify(editDoc.properties, null, 2))
    // expect(fieldNames).toHaveLength(5)
    // expect(fieldNames[0]).toBe('name')
    // expect(fieldNames[1]).toBe('agree')
    // expect(fieldNames[2]).toBe('tel.areaCode')
    // expect(fieldNames[3]).toBe('tel.phoneNumber')
    // expect(fieldNames[4]).toBe('tel')
    // console.log(JSON.stringify(editDoc.build(SampleSchema, true), null, 2))
    editDoc.moveUp('data.script.default')
    console.log(editDoc.names())
    console.log(JSON.stringify(editDoc.build(SampleSchema, true), null, 2))
  })
})
