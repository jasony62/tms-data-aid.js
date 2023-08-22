export const SampleSchema = {
  type: 'object',
  groupable: false,
  readonly: false,
  title: '机器人对话脚本',
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
      title: '机器人对话脚本',
      groupable: false,
      readonly: false,
      required: false,
      properties: {
        dialogId: {
          type: 'string',
          groupable: false,
          readonly: false,
          default: '',
          title: '标识',
          required: true,
        },
        description: {
          type: 'string',
          groupable: false,
          readonly: false,
          default: '',
          title: '描述',
          required: false,
        },
        hears: {
          type: 'array',
          title: '激活关键字',
          required: false,
          items: {
            type: 'string',
          },
        },
        before: {
          type: 'object',
          title: '对话线前置操作集合',
          patternProperties: {
            '^\\w+$': {
              type: 'object',
              title: '对话线前置操作',
              description: '在进入对话线之前执行。',
              properties: {
                handlers: {
                  type: 'array',
                  title: '前置操作数组',
                  description: '按顺序执行的前置操作。',
                  items: {
                    type: 'object',
                    properties: {
                      genericRestApiHandler: {
                        type: 'object',
                        title: '调用RESTAPI',
                        description:
                          '调用RESTAPI，将获得的结果保存在上下文中。',
                        isOneOf: true,
                        properties: {
                          handlerId: {
                            type: 'string',
                            title: '前置操作id',
                            description: '同一个对话中不允许重复。',
                          },
                          url: {
                            type: 'string',
                            title: '调用地址模板',
                            description: '支持通过模板设置参数',
                            format: 'mustache',
                          },
                          method: {
                            type: 'string',
                            title: 'HTTP方法',
                            default: '',
                          },
                          data: {
                            type: 'string',
                            format: 'mustache',
                            title: 'POST方法数据模板',
                            description: 'body中的JSON格式数据模板。',
                          },
                          varskey: {
                            type: 'string',
                            title: '结果变量名称',
                            description: '上下文中保存返回结果的变量名称。',
                          },
                          batch: {
                            type: 'object',
                            title: '批次执行参数',
                            properties: {
                              page: {
                                type: 'object',
                                title: '批次分页参数',
                                properties: {
                                  queryName: {
                                    type: 'string',
                                    title: '批次页号作为查询参数的名称',
                                  },
                                  dataKey: {
                                    type: 'string',
                                    title: '获得的批次数据在上线文中的名称',
                                  },
                                  size: {
                                    type: 'object',
                                    title: '每个批次获得的数据条数',
                                    properties: {
                                      value: {
                                        type: 'number',
                                        title: '最大条数',
                                      },
                                    },
                                  },
                                },
                              },
                              total: {
                                type: 'object',
                                title: '数据总数',
                                properties: {
                                  key: {
                                    type: 'string',
                                    title: '数据总条数在上下文中的名称',
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      gotoHeardThreadHandler: {
                        type: 'object',
                        title: '根据接收关键字进入对话线',
                        isOneOf: true,
                        properties: {
                          threadWhenHeard: {
                            type: 'object',
                            title: '关键字与对话线对应关系',
                            patternProperties: {
                              '^\\w+$': {
                                type: 'string',
                                initialName: 'threadName',
                                title: '对话线进入条件',
                                description: '接收关键字的正则表达式。',
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
        },
        script: {
          type: 'object',
          groupable: false,
          readonly: false,
          title: '脚本内容',
          description: '对话脚本定义。对象的每个属性代表1条对话线。',
          required: true,
          patternProperties: {
            '^\\w+$': {
              type: 'array',
              title: '对话线',
              initialName: 'threadName',
              required: false,
              items: {
                type: 'object',
                properties: {
                  channelData: {
                    type: 'object',
                    title: '回复RCS消息',
                    required: false,
                    properties: {
                      messageList: {
                        type: 'array',
                        title: '消息内容',
                        description: '消息内容的数组。',
                        required: false,
                        items: {
                          type: 'object',
                          properties: {
                            contentType: {
                              type: 'string',
                              title: '消息内容类型',
                            },
                            contentText: {
                              type: 'json',
                              title: '消息内容文本',
                            },
                            contentTextTemplate: {
                              type: 'string',
                              title: '消息内容模板',
                              format: 'mustache',
                            },
                            contentSupplier: {
                              type: 'object',
                              title: '消息内容服务',
                              properties: {
                                url: {
                                  type: 'string',
                                  isOneOf: true,
                                },
                                urlTemplate: {
                                  type: 'string',
                                  isOneOf: true,
                                },
                              },
                            },
                          },
                        },
                      },
                      destinationAddress: {
                        type: 'array',
                        title: '接收人列表',
                        required: false,
                        items: {
                          type: 'string',
                        },
                      },
                      destinationAddressTemplate: {
                        type: 'string',
                        title: '接收人列表模板',
                        format: 'mustache',
                      },
                      individual: {
                        type: 'boolean',
                        title: '独立发送？',
                        description: '每个接收人单独生成消息，不群发。',
                      },
                    },
                  },
                  text: {
                    type: 'string',
                    title: '回复文本消息',
                    required: false,
                  },
                  action: {
                    type: 'string',
                    title: '执行动作',
                    required: false,
                  },
                  collect: {
                    type: 'object',
                    title: '等待用户选择',
                    required: false,
                    properties: {
                      key: {
                        type: 'string',
                        title: '数据存储名称',
                        description: '收集的数据在上下文中的名称。',
                      },
                      options: {
                        type: 'array',
                        title: '用户选项列表',
                        items: {
                          type: 'object',
                          properties: {
                            pattern: {
                              type: 'string',
                              title: '用户输入内容',
                              description: '支持正则表达式。',
                              isOneOf: true,
                            },
                            type: {
                              type: 'string',
                              title: '用户输入类型',
                              default: 'string',
                            },
                            action: {
                              type: 'string',
                              title: '匹配的操作',
                              description: '通过指定线程名称实现处理流程跳转。',
                            },
                            default: {
                              type: 'boolean',
                              title: '默认条件',
                              description: '当其它条件不满足时采用。',
                              isOneOf: true,
                            },
                            execute: {
                              type: 'object',
                              title: '对话脚本参数',
                              description:
                                '当action为beginDialog或execute_script时使用的参数。',
                              properties: {
                                script: {
                                  type: 'string',
                                  title: '对话脚本ID',
                                },
                                thread: {
                                  type: 'string',
                                  title: '对话线名称',
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

export const SampleData = {
  name: 'baidu_search',
  title: '百度搜索',
  data: {
    dialogId: 'baidu_search',
    description: '将百度搜索的结果转换为5G消息卡片。',
    hears: ['百度搜索', 'bdss'],
    before: {
      // produce_card: {
      //   handlers: [
      //     {
      //       genericRestApiHandler: {
      //         url: 'http://host.docker.internal:3000/index/card',
      //         method: 'post',
      //         data: '{"url":"https://wwww.baidu.com/s?wd={{vars.keyword}}"}',
      //         varskey: 'result',
      //       },
      //     },
      //   ],
      // },
    },
    script: {
      produce_card: [
        {
          channelData: {
            messageList: [
              {
                contentSupplier: {
                  urlTemplate:
                    '{{vars.CMS_SERVICE_API}}/content/cardCarousel?id=6343cff7350a1ff1529be51a',
                },
              },
            ],
          },
        },
      ],
      default: [
        {
          text: '请输入搜索关键字',
          action: 'next',
          collect: {
            key: 'keyword',
          },
        },
        {
          action: 'produce_card',
        },
      ],
    },
  },
}
