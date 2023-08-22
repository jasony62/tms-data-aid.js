import { JSONSchemaBuilder } from '@/json-schema/builder'

describe('处理JSONSchema', () => {
  it('测试向前移动属性', () => {
    const schema = {
      type: 'object',
    }

    let counter = 0
    let newName = () => `prop_${++counter}`

    const builder = new JSONSchemaBuilder()
    builder.flatten(schema)
    const rootProp = builder.props[0]
    // 添加
    let newProp1 = builder.addProp(rootProp)
    newProp1.name = newName()
    expect(builder.fullnames()).toEqual(['', 'prop_1'])
    // 添加
    let newProp2 = builder.addProp(rootProp)
    newProp2.name = newName()
    expect(builder.fullnames()).toEqual(['', 'prop_1', 'prop_2'])
    // 在前面添加
    let newProp3 = builder.addPropBefore(newProp2)
    if (newProp3) {
      newProp3.name = newName()
      expect(builder.fullnames()).toEqual(['', 'prop_1', 'prop_3', 'prop_2'])
      // 向后移动
      builder.moveUp(newProp2)
      expect(builder.fullnames()).toEqual(['', 'prop_1', 'prop_2', 'prop_3'])
      // 第1个属性不能向前移动
      expect(builder.canMoveUp(newProp1)).toBeFalsy()
      expect(builder.moveUp(newProp1)).toBeFalsy()
      // 最后1个属性不能向后移动
      expect(builder.canMoveDown(newProp3)).toBeFalsy()
      expect(builder.moveDown(newProp3)).toBeFalsy()

      /**将3个属性改为对象，验证嵌套情况下的是否正确*/
      newProp1.attrs.type = 'object'
      let newProp4 = builder.addProp(newProp1)
      newProp4.name = newName()
      newProp2.attrs.type = 'object'
      let newProp5 = builder.addProp(newProp2)
      newProp5.name = newName()
      newProp3.attrs.type = 'object'
      let newProp6 = builder.addProp(newProp3)
      newProp6.name = newName()
      expect(builder.fullnames()).toEqual([
        '',
        'prop_1',
        'prop_1.prop_4',
        'prop_2',
        'prop_2.prop_5',
        'prop_3',
        'prop_3.prop_6',
      ])
      // 向前移动
      builder.moveUp(newProp3)
      expect(builder.fullnames()).toEqual([
        '',
        'prop_1',
        'prop_1.prop_4',
        'prop_3',
        'prop_3.prop_6',
        'prop_2',
        'prop_2.prop_5',
      ])
      builder.moveUp(newProp3)
      expect(builder.fullnames()).toEqual([
        '',
        'prop_3',
        'prop_3.prop_6',
        'prop_1',
        'prop_1.prop_4',
        'prop_2',
        'prop_2.prop_5',
      ])
      // 向后移动
      builder.moveDown(newProp3)
      expect(builder.fullnames()).toEqual([
        '',
        'prop_1',
        'prop_1.prop_4',
        'prop_3',
        'prop_3.prop_6',
        'prop_2',
        'prop_2.prop_5',
      ])
      builder.moveDown(newProp3)
      expect(builder.fullnames()).toEqual([
        '',
        'prop_1',
        'prop_1.prop_4',
        'prop_2',
        'prop_2.prop_5',
        'prop_3',
        'prop_3.prop_6',
      ])
      // 在后面添加
      let newProp7 = builder.addPropAfter(newProp3)
      if (newProp7) {
        newProp7.name = newName()
        expect(builder.fullnames()).toEqual([
          '',
          'prop_1',
          'prop_1.prop_4',
          'prop_2',
          'prop_2.prop_5',
          'prop_3',
          'prop_3.prop_6',
          'prop_7',
        ])
      }
      let newProp8 = builder.addPropAfter(newProp2)
      if (newProp8) {
        newProp8.name = newName()
        expect(builder.fullnames()).toEqual([
          '',
          'prop_1',
          'prop_1.prop_4',
          'prop_2',
          'prop_2.prop_5',
          'prop_8',
          'prop_3',
          'prop_3.prop_6',
          'prop_7',
        ])
      }
      if (newProp7) {
        let newProp9 = builder.addPropAfter(newProp7)
        if (newProp9) {
          newProp9.name = newName()
          expect(builder.fullnames()).toEqual([
            '',
            'prop_1',
            'prop_1.prop_4',
            'prop_2',
            'prop_2.prop_5',
            'prop_8',
            'prop_3',
            'prop_3.prop_6',
            'prop_7',
            'prop_9',
          ])
        }
      }
    }
  })
  it('测试添加定义', () => {
    const rawSchema_0 = {
      type: 'object',
    }
    const builder_0 = new JSONSchemaBuilder()
    builder_0.flatten(rawSchema_0)
    expect(builder_0.props).toHaveLength(1)
    const rootProp = builder_0.props[0]

    const rawSchema_1 = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        address: {
          type: 'object',
        },
        age: {
          type: 'number',
        },
      },
    }
    let newProps = builder_0.addJSONSchema(rootProp, rawSchema_1)
    expect(newProps.length).toBe(3)
    expect(builder_0.props).toHaveLength(4)
    expect(builder_0.fullnames()).toEqual(['', 'name', 'address', 'age'])

    const rawSchema_2 = {
      type: 'object',
      properties: {
        city: {
          type: 'string',
        },
        district: {
          type: 'string',
        },
        street: {
          type: 'string',
        },
      },
    }
    newProps = builder_0.addJSONSchema(builder_0.props[2], rawSchema_2)
    expect(newProps.length).toBe(3)
    expect(builder_0.props).toHaveLength(7)
    expect(builder_0.fullnames()).toEqual([
      '',
      'name',
      'address',
      'address.city',
      'address.district',
      'address.street',
      'age',
    ])
  })
  it('测试修改属性名称', () => {
    const schema = {
      type: 'object',
      $id: 'https://example.com/schema.json',
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      description: '对象名由正则表达式定义',
      properties: {
        org: {
          type: 'object',
          title: '组织（可扩展对象）',
          properties: {
            name: {
              type: 'string',
              title: '组织名称',
            },
          },
          patternProperties: {
            '^str\\w+$': {
              type: 'string',
              title: '扩展属性简单类型',
              initialName: 'strNewProp',
            },
            '^obj\\w+$': {
              type: 'object',
              title: '扩展属性对象类型',
              initialName: 'objNewProp',
              properties: {
                label: {
                  type: 'string',
                  title: '标题',
                },
                value: {
                  type: 'string',
                  title: '数值',
                },
                extra: {
                  type: 'object',
                  title: '扩展数据',
                  properties: {
                    label: {
                      type: 'string',
                      title: '标题2',
                    },
                    value: {
                      type: 'string',
                      title: '数值2',
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
    const builder = new JSONSchemaBuilder()
    builder.flatten(schema)
    const prop = builder.get('org.^obj\\w+$.extra')
    if (prop) {
      prop.name = 'extra1'
    }
  })
})
