export const SampleSchema = {
  description: '数组中是对象',
  type: 'object',
  properties: {
    experiences: {
      title: '经历',
      type: 'array',
      items: {
        type: 'object',
        patternProperties: {
          '^time$': {
            title: '时间',
            type: 'string',
            initialName: 'time',
          },
          '^content$': {
            title: '内容',
            type: 'string',
            initialName: 'content',
          },
        },
      },
    },
  },
}
