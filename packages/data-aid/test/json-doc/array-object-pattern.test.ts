import { SampleSchema } from '../data/schema-array-object-pattern'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('定义包含数组，数组中项目为对象，生成表单节点', () => {
  it('生成表单节点', () => {
    const editDoc = new DocAsArray({
      experiences: [{ time: '2001' }, { time: '2002' }],
    })
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
    // console.log(JSON.stringify(editDoc._properties, null, 2))
    // console.log(fieldNames)
    expect(fieldNames).toHaveLength(5)
    let i = 0
    expect(fieldNames[i++]).toBe('experiences[0].time')
    expect(fieldNames[i++]).toBe('experiences[1].time')
    expect(fieldNames[i++]).toBe('experiences[1]')
    expect(fieldNames[i++]).toBe('experiences[0]')
    expect(fieldNames[i++]).toBe('experiences')
  })
  it('生成表单节点', () => {
    const editDoc = new DocAsArray({
      experiences: [{ time: '' }, { time: '2002' }],
    })
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
    // console.log(JSON.stringify(editDoc._properties, null, 2))
    // console.log(fieldNames)
    expect(fieldNames).toHaveLength(5)
    let i = 0
    expect(fieldNames[i++]).toBe('experiences[0].time')
    expect(fieldNames[i++]).toBe('experiences[1].time')
    expect(fieldNames[i++]).toBe('experiences[1]')
    expect(fieldNames[i++]).toBe('experiences[0]')
    expect(fieldNames[i++]).toBe('experiences')
  })
})
