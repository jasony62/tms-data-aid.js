export const SampleSchema = {
  $id: 'https://example.com/card.schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '属性依赖示例',
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
    city: {
      title: '城市（下拉框）',
      type: 'string',
      enum: [
        {
          label: '北京',
          value: '010',
        },
        {
          label: '上海',
          value: '021',
        },
      ],
    },
    makeup: {
      title: '化妆品（单条件，女）',
      type: 'string',
      existIf: { properties: { gender: { const: 'female' } } },
    },
    coffee: {
      title: '咖啡（两个条件满足任意1个，女或上海）',
      type: 'string',
      existIf: {
        oneOf: [
          { properties: { gender: { const: 'female' } } },
          { properties: { city: { const: '021' } } },
        ],
      },
    },
    bjOpera: {
      title: '京剧（两个条件同时满足，男+北京）',
      type: 'string',
      existIf: {
        properties: { gender: { const: 'male' }, city: { const: '010' } },
      },
    },
    shOpera: {
      title: '沪剧（两个条件同时满足，男+上海）',
      type: 'string',
      existIf: {
        allOf: [
          { properties: { gender: { const: 'male' } } },
          { properties: { city: { const: '021' } } },
        ],
      },
    },
  },
}
