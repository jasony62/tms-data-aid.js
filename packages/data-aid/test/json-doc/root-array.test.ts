import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

const SampleSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
      age: {
        type: 'number',
      },
    },
  },
}

describe('Schema根属性的类型是数组', () => {
  // it('操作文档，添加字段，设置字段值', () => {
  //   const rawDoc: any[] = []
  //   const doc = new DocAsArray(rawDoc)

  //   const expectNames = ['']
  //   doc.appendAt('', {})
  //   expectNames.push('[0]')
  //   expect(doc.names()).toEqual(expectNames)

  //   doc.set('[0].name', 'abc')
  //   expectNames.push('[0].name')
  //   doc.set('[0].title', '123')
  //   expectNames.push('[0].title')
  //   doc.set('[0].age', 99)
  //   expectNames.push('[0].age')
  //   expect(doc.names()).toEqual(expectNames)

  //   doc.appendAt('', {})
  //   expectNames.push('[1]')
  //   expect(doc.names()).toEqual(expectNames)

  //   doc.set('[1].name', 'xyz')
  //   expectNames.push('[1].name')
  //   doc.set('[1].title', '789')
  //   expectNames.push('[1].title')
  //   doc.set('[1].age', 11)
  //   expectNames.push('[1].age')
  //   expect(doc.names()).toEqual(expectNames)

  //   const newObj = doc.build(SampleSchema)
  //   const expectOutput = [
  //     { name: 'abc', title: '123', age: 99 },
  //     { name: 'xyz', title: '789', age: 11 },
  //   ]
  //   expect(newObj).toMatchObject(expectOutput)
  // })
  it('构造表单', () => {
    const editDoc = new DocAsArray([])
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

    expect(fieldNames).toHaveLength(0)
    // const expectNames = ['']
    // expect(fieldNames).toEqual(expectNames)
  })
})
