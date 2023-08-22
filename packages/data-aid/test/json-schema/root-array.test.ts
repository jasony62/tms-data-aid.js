import { JSONSchemaBuilder } from '@/json-schema/builder'

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

describe('根属性类型是数组', () => {
  it('解析schema', () => {
    const builder = new JSONSchemaBuilder()
    builder.flatten(SampleSchema)
    const expectNames = ['', '[*].name', '[*].title', '[*].age']
    expect(builder.fullnames()).toEqual(expectNames)
    // console.log(builder.props)
  })
  it('新建schema', () => {
    const builder = new JSONSchemaBuilder('$')
    builder.flatten({ type: 'array' })
    const expectNames = ['$']
    expect(builder.fullnames()).toEqual(expectNames)
    const rootProp = builder.props[0]

    const p1 = builder.addProp(rootProp)
    p1.attrs.type = 'object'
    p1.name = 'replySupplier'
    expectNames.push('$[*].replySupplier')
    expect(builder.fullnames()).toEqual(expectNames)

    let p1_1 = builder.addProp(p1)
    p1_1.attrs.type = 'string'
    p1_1.name = 'url'
    expectNames.push('$[*].replySupplier.url')
    expect(builder.fullnames()).toEqual(expectNames)

    const p2 = builder.addProp(rootProp)
    p2.attrs.type = 'object'
    p2.name = 'reply'
    expectNames.push('$[*].reply')
    expect(builder.fullnames()).toEqual(expectNames)

    let p2_1 = builder.addProp(p2)
    p2_1.attrs.type = 'string'
    p2_1.name = 'displayText'
    expectNames.push('$[*].reply.displayText')
    expect(builder.fullnames()).toEqual(expectNames)

    let p2_2 = builder.addProp(p2)
    p2_2.attrs.type = 'object'
    p2_2.name = 'postback'
    expectNames.push('$[*].reply.postback')
    expect(builder.fullnames()).toEqual(expectNames)

    let p2_2_1 = builder.addProp(p2_2)
    p2_2_1.attrs.type = 'string'
    p2_2_1.name = 'data'
    expectNames.push('$[*].reply.postback.data')
    expect(builder.fullnames()).toEqual(expectNames)

    let p3 = builder.addPropAfter(p2)
    if (p3) {
      p3.attrs.type = 'object'
      p3.name = 'action'
      expectNames.push('$[*].action')
      expect(builder.fullnames()).toEqual(expectNames)
    }

    // console.log(builder.props)
  })
})
