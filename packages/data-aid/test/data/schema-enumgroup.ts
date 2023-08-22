export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '基本示例',
  type: 'object',
  properties: {
    resource: {
      title: '特殊资源',
      type: 'string',
      required: true,
      enum: [
        {
          label: '线上品牌赞助',
          value: 'a',
        },
        {
          label: '线下场地赞助',
          value: 'b',
        },
      ],
    },
    methods: {
      title: '活动形式',
      type: 'string',
      required: true,
      enum: [
        {
          label: '线上',
          value: 'a',
          group: 'v1',
        },
        {
          label: '线下',
          value: 'b',
          group: 'v2',
        },
      ],
      enumGroups: [
        {
          id: 'v1',
          label: '分组1',
          assocEnum: {
            property: 'resource',
            value: 'a',
          },
        },
        {
          id: 'v2',
          label: '分组2',
          assocEnum: {
            property: 'resource',
            value: 'b',
          },
        },
      ],
    },
  },
}
