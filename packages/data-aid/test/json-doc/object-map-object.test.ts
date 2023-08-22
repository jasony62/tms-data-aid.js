import { SampleSchema } from '../data/schema-object-map'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('对象包含可选属性，可选属性为对象类型', () => {
  it('生成表单节点', () => {
    const rawDoc = {
      org: {
        name: '研发部',
        strProduct: 'tms-vue3-kit',
        'str in valid': '123',
        objAbc: { label: 'aaa', value: '111' },
        objXyz: { label: 'xxx', value: '999' },
      },
    }
    const editDoc = new DocAsArray(rawDoc)
    const fieldNames: string[] = []
    build(
      {
        schema: SampleSchema,
        fields: new Map(),
        editDoc,
        onMessage: (msg: string) => {
          console.log(msg)
        },
      },
      fieldNames
    )
    // console.log(JSON.stringify(editDoc.properties, null, 2))
    // console.log(fieldNames)
    let i = 0
    expect(fieldNames).toHaveLength(15)
    expect(fieldNames[i++]).toBe('org.name')
    expect(fieldNames[i++]).toBe('org.strProduct')
    expect(fieldNames[i++]).toBe('org.objAbc.label')
    expect(fieldNames[i++]).toBe('org.objXyz.label')
    expect(fieldNames[i++]).toBe('org.objAbc.value')
    expect(fieldNames[i++]).toBe('org.objXyz.value')
    expect(fieldNames[i++]).toBe('org.objAbc.extra.label')
    expect(fieldNames[i++]).toBe('org.objXyz.extra.label')
    expect(fieldNames[i++]).toBe('org.objAbc.extra.value')
    expect(fieldNames[i++]).toBe('org.objXyz.extra.value')
    expect(fieldNames[i++]).toBe('org.objXyz.extra')
    expect(fieldNames[i++]).toBe('org.objAbc.extra')
    expect(fieldNames[i++]).toBe('org.objXyz')
    expect(fieldNames[i++]).toBe('org.objAbc')
    expect(fieldNames[i++]).toBe('org')
  })
})
