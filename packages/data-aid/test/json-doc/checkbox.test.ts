import { SampleSchema } from '../data/schema-checkbox'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('定义包含数组，数组中项目为对象，生成表单节点', () => {
  it('生成表单节点', () => {
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
    console.log(fieldNames)
    expect(fieldNames).toHaveLength(1)
    let i = 0
    expect(fieldNames[i++]).toBe('hobbies')
  })
  // it('添加选项', () => {
  //   const editDoc = new DocAsArray({})
  //   const fieldNames: string[] = []
  //   build(
  //     {
  //       schema: SampleSchema,
  //       editDoc,
  //       onMessage: (msg: string) => {
  //         console.log(msg)
  //       },
  //     },
  //     fieldNames
  //   )
  //   editDoc.appendAt('hobbies', 'book')
  //   console.log(editDoc.properties)
  //   // console.log(fieldNames)
  //   // expect(fieldNames).toHaveLength(7)
  //   // let i = 0
  //   // expect(fieldNames[i++]).toBe('experiences')
  //   // expect(fieldNames[i++]).toBe('experiences[0]')
  //   // expect(fieldNames[i++]).toBe('experiences[1]')
  //   // expect(fieldNames[i++]).toBe('experiences[1].time')
  //   // expect(fieldNames[i++]).toBe('experiences[0].time')
  //   // expect(fieldNames[i++]).toBe('experiences[1].content')
  //   // expect(fieldNames[i++]).toBe('experiences[0].content')
  // })
})
