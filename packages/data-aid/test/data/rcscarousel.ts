export const SampleSchema = {
  type: 'object',
  groupable: false,
  dependencies: {},
  eventDependencies: {},
  readonly: false,
  required: false,
  properties: {
    name: {
      type: 'string',
      title: '名称',
    },
    title: {
      type: 'string',
      title: '标题',
    },
    data: {
      type: 'object',
      title: '多卡片消息',
      required: false,
      properties: {
        contentType: {
          type: 'string',
          readonly: true,
          title: '内容类型',
          default: 'application/vnd.gsma.botmessage.v1.0+json',
        },
        contentText: {
          type: 'object',
          title: '内容文本',
          required: false,
          properties: {
            message: {
              type: 'object',
              title: '消息内容',
              required: false,
              properties: {
                generalPurposeCardCarousel: {
                  type: 'object',
                  title: '多卡片定义',
                  required: false,
                  properties: {
                    layout: {
                      type: 'object',
                      title: '多卡片布局',
                      required: false,
                      properties: {
                        cardWidth: {
                          type: 'string',
                          default: 'MEDIUM_WIDTH',
                          title: '卡片宽度',
                          required: false,
                        },
                      },
                    },
                    content: {
                      type: 'array',
                      title: '卡片内容',
                      description: '包含2-12个卡片定义。',
                      isOneOf: true,
                      items: {
                        type: 'object',
                        patternProperties: {
                          '^media$': {
                            type: 'object',
                            initialName: 'media',
                            title: '卡片媒体文件',
                            format: 'file',
                            required: false,
                            properties: {
                              mediaUrl: {
                                type: 'string',
                                title: '媒体文件地址',
                                required: false,
                              },
                              mediaUrlTemplate: {
                                type: 'string',
                                title: '媒体文件地址模板',
                              },
                              mediaContentType: {
                                type: 'string',
                                title: '媒体文件内容类型',
                                required: false,
                              },
                              mediaFileSize: {
                                type: 'number',
                                title: '媒体文件大小（字节）',
                                required: false,
                              },
                              thumbnailUrl: {
                                type: 'string',
                                title: '缩略图地址',
                                required: false,
                              },
                              thumbnailUrlTemplate: {
                                type: 'string',
                                title: '缩略图地址模板',
                              },
                              thumbnailContentType: {
                                type: 'string',
                                title: '缩略图内容类型',
                                required: false,
                              },
                              thumbnailFileSize: {
                                type: 'number',
                                title: '缩略图文件大小（字节）',
                                required: false,
                              },
                              height: {
                                type: 'string',
                                title: '图片的高度',
                                required: false,
                              },
                              contentDescription: {
                                type: 'string',
                                title: '媒体文件内容说明',
                                required: false,
                              },
                            },
                          },
                          '^mediaSupplier$': {
                            type: 'object',
                            initialName: 'mediaSupplier',
                            title: '获取卡片媒体文件数据',
                            properties: {
                              url: {
                                type: 'string',
                                title: '获取数据地址',
                                isOneOf: true,
                              },
                              id: {
                                type: 'string',
                                title: '数据ID',
                                isOneOf: true,
                              },
                            },
                          },
                          '^title$': {
                            type: 'string',
                            initialName: 'title',
                            title: '卡片标题',
                          },
                          '^titleTemplate$': {
                            type: 'string',
                            initialName: 'titleTemplate',
                            title: '卡片标题模板',
                          },
                          '^titleSupplier$': {
                            type: 'object',
                            initialName: 'titleSupplier',
                            title: '卡片标题服务',
                            properties: {
                              url: {
                                type: 'string',
                                title: '获取数据地址',
                                isOneOf: true,
                              },
                              id: {
                                type: 'string',
                                title: '数据ID',
                                isOneOf: true,
                              },
                            },
                          },
                          '^description$': {
                            type: 'string',
                            initialName: 'description',
                            title: '卡片说明',
                          },
                          '^descriptionTemplate$': {
                            type: 'string',
                            initialName: 'descriptionTemplate',
                            title: '卡片说明模板',
                          },
                          '^descriptionSupplier$': {
                            type: 'object',
                            initialName: 'descriptionSupplier',
                            title: '卡片说明服务',
                            properties: {
                              url: {
                                type: 'string',
                                title: '获取数据地址',
                                isOneOf: true,
                              },
                              id: {
                                type: 'string',
                                title: '数据ID',
                                isOneOf: true,
                              },
                            },
                          },
                          '^suggestions$': {
                            type: 'json',
                            initialName: 'suggestions',
                            title: '卡片建议列表',
                          },
                          '^suggestionsSupplier$': {
                            type: 'object',
                            initialName: 'suggestionsSupplier',
                            title: '建议列表服务',
                            properties: {
                              url: {
                                type: 'string',
                                title: '获取数据地址',
                                isOneOf: true,
                              },
                              id: {
                                type: 'string',
                                title: '数据ID',
                                isOneOf: true,
                              },
                            },
                          },
                        },
                      },
                    },
                    contentSupplier: {
                      type: 'object',
                      title: '卡片内容服务',
                      isOneOf: true,
                      properties: {
                        url: {
                          type: 'string',
                          title: '获取数据地址',
                          isOneOf: true,
                        },
                        id: {
                          type: 'string',
                          title: '数据ID',
                          isOneOf: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    keywords: {
      type: 'array',
      title: '关键字',
      items: {
        type: 'string',
      },
    },
    remark: {
      type: 'string',
      title: '备注',
    },
  },
}

export const SampleData = {}
