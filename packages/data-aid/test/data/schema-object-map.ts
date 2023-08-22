export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '对象名由正则表达式定义',
  type: 'object',
  properties: {
    org: {
      title: '组织（可扩展对象）',
      type: 'object',
      properties: {
        name: {
          title: '组织名称',
          type: 'string',
        },
      },
      patternProperties: {
        '^str\\w+$': {
          title: '扩展属性简单类型',
          type: 'string',
        },
        '^obj\\w+$': {
          title: '扩展属性对象类型',
          type: 'object',
          properties: {
            label: {
              title: '标题',
              type: 'string',
            },
            value: {
              title: '数值',
              type: 'string',
            },
            extra: {
              title: '扩展数据',
              type: 'object',
              properties: {
                label: {
                  title: '标题2',
                  type: 'string',
                },
                value: {
                  title: '数值2',
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
}
