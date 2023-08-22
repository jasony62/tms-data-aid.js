import { SampleSchema } from '../data/schema-simple'
import { SchemaIter } from '@/json-schema/model'

describe('处理JSONSchema', () => {
  // it('迭代JSONSchema属性', () => {
  //   // console.log(JSON.stringify(SampleSchema, null, 2))
  //   const iter = new SchemaIter(SampleSchema)
  //   console.log('iter', Array.from(iter))
  // })
  it('迭代JSONSchema属性2', () => {
    // console.log(JSON.stringify(SampleSchema, null, 2))
    let rawSchema = {
      type: 'object',
      properties: {
        username: { type: 'string', title: '机器人平台用户账号' },
        password: {
          type: 'string',
          title: '机器人平台用户密码',
          format: 'password',
        },
        sipAccount: { type: 'string', title: '机器人平台SIP账号' },
        qywxUserId: {
          type: 'string',
          title: '企业微信用户ID',
          description: '用于通过企业微信发送消息。',
        },
      },
    }
    const iter = new SchemaIter(rawSchema)
    // console.log('iter', Array.from(iter))
    // for (let prop of iter) {
    //   console.log('ppp', prop)
    // }
  })
})
