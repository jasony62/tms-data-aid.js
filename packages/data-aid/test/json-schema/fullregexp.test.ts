import { SchemaIter } from '@/json-schema/model'

describe('检查名称是否与属性定义名称匹配', () => {
  it('固定属性名称', () => {
    const SampleSchema = {
      type: 'object',
      properties: {
        p_1: {
          type: 'string',
        },
        p_2: {
          type: 'object',
          properties: {
            p_2_1: {
              type: 'string',
            },
          },
        },
      },
    }

    const iter = new SchemaIter(SampleSchema)
    let fullRegExps = []
    for (let prop of iter) fullRegExps.push(prop.fullRegExp)
    expect(fullRegExps).toHaveLength(4)
    expect(fullRegExps[0].toString()).toBe('/^$/')
    expect(fullRegExps[1].toString()).toBe('/^p_1$/')
    expect(fullRegExps[2].toString()).toBe('/^p_2$/')
    expect(fullRegExps[3].toString()).toBe('/^p_2\\.p_2_1$/')
    expect(fullRegExps[0].test('')).toBeTruthy()
    expect(fullRegExps[1].test('p_1')).toBeTruthy()
    expect(fullRegExps[2].test('p_2')).toBeTruthy()
    expect(fullRegExps[3].test('p_2.p_2_1')).toBeTruthy()
  })
  it('数组属性', () => {
    const SampleSchema = {
      type: 'object',
      properties: {
        p_1: {
          type: 'string',
        },
        p_2: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        p_3: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              p_3_1: {
                type: 'string',
              },
            },
          },
        },
      },
    }

    const iter = new SchemaIter(SampleSchema)
    let fullRegExps = []
    for (let prop of iter) fullRegExps.push(prop.fullRegExp)
    expect(fullRegExps).toHaveLength(5)
    expect(fullRegExps[0].toString()).toBe('/^$/')
    expect(fullRegExps[1].toString()).toBe('/^p_1$/')
    expect(fullRegExps[2].toString()).toBe('/^p_2(\\[\\d+\\])?$/')
    expect(fullRegExps[3].toString()).toBe('/^p_3$/')
    expect(fullRegExps[4].toString()).toBe('/^p_3\\[\\d+\\]\\.p_3_1$/')

    expect(
      fullRegExps[2].test('p_2[' + Math.floor(Math.random() * 10) + ']')
    ).toBeTruthy()
    expect(
      fullRegExps[4].test('p_3[' + Math.floor(Math.random() * 10) + '].p_3_1')
    ).toBeTruthy()
  })
  // it('数组属性的子项目是数组', () => {
  //   const SampleSchema = {
  //     type: 'object',
  //     properties: {
  //       p_1: {
  //         type: 'string',
  //       },
  //       p_2: {
  //         type: 'array',
  //         items: {
  //           type: 'array',
  //           items: {
  //             type: 'string',
  //           },
  //         },
  //       },
  //     },
  //   }

  //   const iter = new SchemaIter(SampleSchema)
  //   let fullRegExps = []
  //   for (let prop of iter) fullRegExps.push(prop.fullRegExp)
  //   expect(fullRegExps).toHaveLength(5)
  // })
  it('模板属性', () => {
    const SampleSchema = {
      type: 'object',
      properties: {
        p_1: {
          type: 'string',
        },
      },
      patternProperties: {
        '^abc\\w+': {
          type: 'string',
        },
        '^xyz\\w+': {
          type: 'object',
          properties: {
            xyz__1: {
              type: 'string',
            },
          },
        },
      },
    }

    const iter = new SchemaIter(SampleSchema)
    let fullRegExps = []
    for (let prop of iter) fullRegExps.push(prop.fullRegExp)
    expect(fullRegExps).toHaveLength(5)
    expect(fullRegExps[0].toString()).toBe('/^$/')
    expect(fullRegExps[1].toString()).toBe('/^p_1$/')
    expect(fullRegExps[2].toString()).toBe('/^abc\\w+$/')
    expect(fullRegExps[3].toString()).toBe('/^xyz\\w+$/')
    expect(fullRegExps[4].toString()).toBe('/^xyz\\w+\\.xyz__1$/')
    expect(fullRegExps[4].test('xyzAbc.xyz__1')).toBeTruthy()
  })
})
