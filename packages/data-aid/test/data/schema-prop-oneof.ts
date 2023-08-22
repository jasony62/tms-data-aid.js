export const SampleSchema = {
  type: 'object',
  required: false,
  title: '建议列表定义',
  properties: {
    suggestions: {
      type: 'array',
      required: false,
      title: '建议数组',
      items: {
        type: 'object',
        properties: {
          reply: {
            type: 'object',
            required: false,
            isOneOf: true,
            title: '建议回复',
            properties: {
              displayText: {
                type: 'string',
                required: false,
                title: '显示内容',
              },
              postback: {
                type: 'object',
                required: false,
                title: '回复数据',
                properties: {
                  data: {
                    type: 'string',
                    required: false,
                    title: '回复数据的值',
                  },
                },
              },
            },
          },
          action: {
            type: 'object',
            required: false,
            isOneOf: true,
            title: '建议操作',
            properties: {
              diaplayText: {
                type: 'string',
                required: false,
                title: '显示内容',
              },
              postback: {
                type: 'object',
                required: false,
                title: '回复数据',
                properties: {
                  data: {
                    type: 'string',
                    required: false,
                    title: '回复数据的值',
                  },
                },
              },
            },
            patternProperties: {
              '^\\w+Action$': {
                type: 'json',
                required: false,
                initialName: 'urlAction',
                title: '建议操作的参数',
                description:
                  '每种建议操作都有自己的参数，规范中制定了几种操作，也可自行扩展。',
              },
            },
          },
        },
      },
    },
  },
}
