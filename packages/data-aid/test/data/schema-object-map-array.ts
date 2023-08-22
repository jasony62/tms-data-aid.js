export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '对象可选属性的子属性为数组，数组项目为对象',
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
        '^arr\\w+$': {
          title: '扩展属性对象类型',
          type: 'array',
          items: {
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
            },
          },
        },
      },
    },
  },
}
