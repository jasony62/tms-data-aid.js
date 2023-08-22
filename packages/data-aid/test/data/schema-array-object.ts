export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '数组中是对象',
  type: 'object',
  properties: {
    experiences: {
      title: '经历',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          time: {
            title: '时间',
            type: 'string',
          },
          content: {
            title: '内容',
            type: 'string',
          },
        },
      },
    },
  },
}
