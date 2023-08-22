export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '基本示例',
  type: 'object',
  properties: {
    additionalName: {
      title: '其他名称（基础类型数组）',
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
}
