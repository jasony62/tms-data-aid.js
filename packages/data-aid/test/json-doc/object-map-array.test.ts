import { SampleSchema } from '../data/schema-object-map-array'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('对象包含可选属性，可选属性为数组类型', () => {
  it('生成表单节点', () => {
    const rawDoc = {
      org: {
        name: '研发部',
        arrAbc: [{ label: 'aaa', value: '111' }],
        arrXyz: [{ label: 'xxx', value: '999' }],
      },
    }
    const editDoc = new DocAsArray(rawDoc)
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
    expect(fieldNames).toHaveLength(10)
    let i = 0
    expect(fieldNames[i++]).toBe('org.name')
    expect(fieldNames[i++]).toBe('org.arrAbc[0].label')
    expect(fieldNames[i++]).toBe('org.arrXyz[0].label')
    expect(fieldNames[i++]).toBe('org.arrAbc[0].value')
    expect(fieldNames[i++]).toBe('org.arrXyz[0].value')
    expect(fieldNames[i++]).toBe('org.arrXyz[0]')
    expect(fieldNames[i++]).toBe('org.arrXyz')
    expect(fieldNames[i++]).toBe('org.arrAbc[0]')
    expect(fieldNames[i++]).toBe('org.arrAbc')
    expect(fieldNames[i++]).toBe('org')
  })
})
