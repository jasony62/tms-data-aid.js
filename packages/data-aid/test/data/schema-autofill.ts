export const SampleSchema = {
  $id: 'https://example.com/schema.json',
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  description: '属性值自动填充',
  type: 'object',
  properties: {
    areaCode: {
      title: '区号',
      type: 'string',
      enum: [],
      autofill: {
        url: 'http://tms-vue3-kit/autofill/areaCode',
        method: 'GET',
        target: 'items',
        runPolicy: 'onCreate',
        itemPath: {
          path: 'data.result',
          value: 'code',
          label: 'code',
        },
      },
    },
    city: {
      title: '市',
      type: 'string',
      autofill: {
        url: 'http://tms-vue3-kit/autofill/city',
        method: 'GET',
        params: [
          { path: 'areaCode', name: 'areaCode' },
          { value: 'tms-vue3-ui', name: 'fromApp' },
        ],
        target: 'value',
        runPolicy: 'onParamChange',
        valuePath: 'data.result.city',
      },
    },
    district: {
      title: '区',
      type: 'string',
      oneOf: [],
      autofill: {
        url: 'http://tms-vue3-kit/autofill/district',
        method: 'POST',
        body: [
          { path: 'areaCode', bodyPath: 'filter.areaCode.keyword' },
          { value: 'start', bodyPath: 'filter.areaCode.feature' },
        ],
        target: 'items',
        runPolicy: 'onParamChange',
        itemPath: {
          path: 'data.result.district',
          value: 'name',
          label: 'name',
        },
      },
    },
  },
}
