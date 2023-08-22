export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '基本示例',
  type: 'object',
  properties: {
    areaCode: {
      title: '区号（选项）',
      type: 'string',
      enum: [
        {
          label: '010',
          value: '010',
        },
        {
          label: '029',
          value: '029',
        },
      ],
    },
  },
}
