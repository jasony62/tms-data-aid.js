export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '基本示例',
  type: 'object',
  properties: {
    gender: {
      title: '性别（单选框）',
      type: 'string',
      oneOf: [
        {
          label: '男',
          value: 'male',
        },
        {
          label: '女',
          value: 'female',
        },
      ],
    },
    age: {
      title: '年龄（性别为男才出现）',
      type: 'string',
      existIf: [{ gender: { const: 'male' } }],
    },
  },
}
