import { SampleSchema } from '../data/schema-file'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('对象包含数组，数组的项目是文件', () => {
  it('生成表单节点', () => {
    const rawDoc = { files: [{}, {}] }
    const editDoc = new DocAsArray(rawDoc)
    const fieldNames: string[] = []
    const onFileDownload = () => {}
    const ctx = {
      schema: SampleSchema,
      editDoc,
      fields: new Map(),
      onMessage: (msg: string) => {
        console.log(msg)
      },
      onFileDownload,
    }
    const vnodes = build(ctx, fieldNames)
    // console.log(fieldNames)
    // console.log(vnodes[0].children)

    expect(fieldNames).toHaveLength(7)
    let i = 0
    expect(fieldNames[i++]).toBe('files[0].name')
    expect(fieldNames[i++]).toBe('files[1].name')
    expect(fieldNames[i++]).toBe('files[0].url')
    expect(fieldNames[i++]).toBe('files[1].url')
    expect(fieldNames[i++]).toBe('files[1]')
    expect(fieldNames[i++]).toBe('files[0]')
    expect(fieldNames[i++]).toBe('files')
  })
})
