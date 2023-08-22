export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '文件上传字段',
  type: 'object',
  properties: {
    files: {
      type: 'array',
      title: '上传文件',
      items: {
        type: 'object',
        properties: {
          name: {
            title: '名字',
            type: 'string',
          },
          url: {
            title: '地址',
            type: 'string',
          },
        },
        format: 'file',
        formatAttrs: {
          accept: 'png,jpeg',
          size: '0.048',
          limit: 1,
        },
      },
      attachment: [
        {
          name: '1.jpg',
          url: 'http://www.baidu.com',
        },
        {
          name: '2.jpg',
          url: 'http://www.baidu.com',
        },
      ],
    },
  },
}
