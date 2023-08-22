import { transform } from '../../src/transform'

describe('测试数据转换函数transform', () => {
  test('用常量构造对象', () => {
    const rule = {
      a: 'hello',
      b: 1,
      c: false,
    }
    const result = transform(rule)
    console.log(result)
  })
  test('基本转换', () => {
    const rule = {
      a: '$.a',
      b: 1,
      c: false,
    }
    const data = { a: 'hello' }
    const result = transform(rule, data)
    console.log(result)
  })
  test('根据对象值决定填充规则', () => {
    const rule = {
      "$[?(@.type==='file')]": { x: '$.a' },
      "$[?(@.type==='thumbnail')]": { x: '$.b' },
    }
    const data = { a: 'file-prop', b: 'thumbnial-prop' }
    const target = { type: 'file' }
    const result1 = transform(rule, data, target)
    console.log(result1)
    target.type = 'thumbnail'
    const result2 = transform(rule, data, target)
    console.log(result2)
  })
})
