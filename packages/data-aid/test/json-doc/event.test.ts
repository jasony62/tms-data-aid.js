import { SampleSchema } from '../data/schema-autofill'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

describe('通过API从外部获取值', () => {
  it('返回字段的值', (done) => {
    const onAxios = () => {
      return {
        post: (...args: any) => {
          return new Promise((resolve, reject) => {
            let result = { data: { result: { province: '北京' } } }
            resolve(result)
          })
        },
      }
    }
    const editDoc = new DocAsArray({})
    const nodes = build({
      schema: SampleSchema,
      editDoc,
      onMessage: (msg: string) => {
        console.log(msg)
      },
      autofillRequest: onAxios,
    })
    // console.log(JSON.stringify(nodes, null, 2))
    setTimeout(() => {
      console.log('editDoc', editDoc)
      done()
    }, 1000)
  })
})
