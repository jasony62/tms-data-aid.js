export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '多选',
  type: 'object',
  properties: {
    hobbies: {
      title: '爱好（多选框）',
      type: 'string',
      anyOf: [
        {
          label: '美食',
          value: 'food',
        },
        {
          label: '读书',
          value: 'book',
        },
        {
          label: '电影',
          value: 'film',
        },
        {
          label: '旅游',
          value: 'trip',
        },
      ],
    },
  },
}
