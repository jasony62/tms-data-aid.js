export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '基本示例',
  type: 'object',
  properties: {
    name: {
      title: '姓名',
      type: 'string',
    },
    agree: {
      title: '同意？（布尔）',
      type: 'boolean',
    },
    tel: {
      title: '电话（对象）',
      type: 'object',
      properties: {
        areaCode: {
          title: '区号',
          type: 'string',
        },
        phoneNumber: {
          title: '号码',
          type: 'string',
        },
      },
    },
  },
}
