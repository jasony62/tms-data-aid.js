import { SampleSchema } from '../data/dialog-script'
import { build } from '@/json-doc/builder'
import { DocAsArray } from '@/json-doc/model'

const SampleData = {
  dialogId: 'biyi-gongshi',
  description: '比翼工时填报机器人。',
  hears: ['gongshi', '工时'],
  before: {
    waitLaunch: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'launch',
          },
        },
      ],
    },
    waitGotoLogin: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              goto: {
                url: 'https://cas.ctbiyi.com/cas/login',
                waitForSelector: '#login-form-controls',
              },
              screenshot: { selector: '#login-captcha' },
            },
          },
        },
      ],
    },
    waitRenewCaptcha: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              action: {
                '#login-captcha': {
                  click: { clickCount: 1 },
                },
                '#captcha-customField': {
                  fill: '',
                },
              },
              waitFor: { timeout: 1000 },
              screenshot: { selector: '#login-captcha' },
            },
          },
        },
      ],
    },
    waitShowNewCaptcha: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              screenshot: { selector: '#login-captcha' },
            },
          },
        },
      ],
    },
    waitFillAndSubmit: {
      handlers: [
        {
          genericRestApiHandler: {
            url: 'http://host.docker.internal:3030/api/unseal/document/findOne?db=biyi&cl=users_5gmc&fields=biyiUsername,biyiPassword',
            method: 'post',
            data: {
              filter: { username: '{{vars.RCSMSG_FROM.parameters.magic}}' },
            },
            varskey: 'vars.biyiAccount',
          },
        },
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              action: {
                '#username': {
                  fill: '{{vars.biyiAccount.result.biyiUsername}}',
                },
                '#password': {
                  fill: '{{vars.biyiAccount.result.biyiPassword}}',
                },
                '#captcha-customField': { fill: '{{vars.expectCaptcha}}' },
                '#login-btn': {
                  click: { clickCount: 1 },
                },
              },
              waitFor: { timeout: 2000 },
              find: [
                { '#login-btn > span': { alias: 'denglushibai' } },
                { '#aupSubmit': { alias: 'anquanchengnuo' } },
                { '#content > div > h2 > span': { alias: 'dengluchenggong' } },
              ],
              screenshot: {},
            },
          },
        },
      ],
    },
    waitClickAgree: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              action: {
                '#aupSubmit': {
                  click: { clickCount: 1, waitForTimeout: 10000 },
                },
              },
            },
          },
        },
      ],
    },
    waitGotoWorkbench: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              goto: {
                url: 'https://workbench.ctbiyi.com/home',
                options: { waitUntil: 'networkidle0' },
              },
            },
          },
        },
      ],
    },
    waitGotoZentaoCalendar: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              goto: {
                url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=my&f=index',
                options: { waitUntil: 'networkidle0' },
              },
            },
          },
        },
      ],
    },
    waitGotoCalendar: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              goto: {
                url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=effort&f=calendar',
                options: { waitUntil: 'networkidle0' },
              },
            },
          },
        },
      ],
    },
    waitGotoZentaoEffort: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              goto: {
                url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=my&f=index',
                options: { waitUntil: 'networkidle0' },
              },
            },
          },
        },
      ],
    },
    waitGotoEffort: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              goto: {
                url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=my&f=effort&date=all',
                options: { waitUntil: 'networkidle0' },
              },
            },
          },
        },
      ],
    },
    waitGotoZentaoAddEffort: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              goto: {
                url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=my&f=index',
                options: { waitUntil: 'networkidle0' },
              },
            },
          },
        },
      ],
    },
    waitGotoAddEffort: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'interact',
            demand: {
              goto: {
                url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=effort&f=batchCreate',
                options: { waitUntil: 'networkidle0' },
              },
            },
          },
        },
      ],
    },
    waitAddEffort: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'http',
            demand: {
              method: 'get',
              url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=project&f=ajaxSelectProjectsByProjectType&page1=1&recPerPage=10&sortBy=&order=asc&projectType=all',
            },
          },
        },
      ],
    },
    waitSubmitEffort: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'http',
            demand: {
              method: 'post',
              url: 'https://workbench.ctbiyi.com/zentao/www/index.php?m=effort&f=batchCreate',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: {
                id: [1],
                objectType: ['custom'],
                date: '{{vars.expectDate}}',
                work: ['{{vars.expectWork}}'],
                projectType: ['{{vars.expectProductId}}'],
                consumed: ['{{vars.expectConsumed}}'],
              },
            },
          },
        },
      ],
    },
    collectEffortDate: {
      handlers: [
        {
          genericDatetimeHandler: {
            varskey: 'weekWorkdays',
            perset: { name: 'WeekWorkdays', end: -1 },
            textFormat: 'dddd',
            valueFormat: 'YYYY-MM-DD',
          },
        },
      ],
    },
    waitClose: {
      handlers: [
        {
          tpwDialogHandler: {
            command: 'close',
          },
        },
      ],
    },
  },
  script: {
    default: [
      {
        text: '{{vars.RCSMSG_FROM.parameters.magic}} 你好，欢迎使用RPA机器人',
        action: 'waitLaunch',
      },
    ],
    waitLaunch: [
      {
        text: '请等待【启动应用】操作执行结果',
        collect: {
          key: 'beginResult',
          options: [
            { pattern: 'created', type: 'string', action: 'next' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
      { text: '已经启动RPA', action: 'waitGotoLogin' },
    ],
    waitGotoLogin: [
      {
        text: '请等待【打开登录页】操作执行结果',
        collect: {
          key: 'gotoResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'showCaptcha' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
    ],
    showCaptcha: [
      {
        channelData: {
          messageList: [
            {
              contentType: 'application/vnd.gsma.botmessage.v1.0+json',
              contentText: {
                message: {
                  generalPurposeCard: {
                    layout: {
                      cardOrientation: 'HORIZONTAL',
                      imageAlignment: 'LEFT',
                      titleFontStyle: ['underline', 'bold'],
                      descriptionFontStyle: ['calibri'],
                      style: 'http://example.com/default.css',
                    },
                    content: {
                      media: {
                        mediaUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        mediaContentType: 'image/png',
                        mediaFileSize: 2,
                        thumbnailUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        thumbnailContentType: 'image/png',
                        thumbnailFileSize: 1,
                        height: 'MEDIUM_HEIGHT',
                        contentDescription: '',
                      },
                      title: '登录验证码',
                      descriptionTemplate:
                        '网页地址：https://cas.ctbiyi.com/cas/login。请选择【重新生成验证码】，或直接输入验证码。',
                      suggestions: [
                        {
                          reply: {
                            displayText: '重新生成验证码',
                            postback: {
                              data: 'renew_captcha',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
        collect: {
          key: 'expectCaptcha',
          options: [
            {
              pattern: 'renew_captcha',
              type: 'string',
              action: 'waitRenewCaptcha',
            },
            { default: true, action: 'waitFillAndSubmit' },
          ],
        },
        action: 'next',
      },
    ],
    waitRenewCaptcha: [
      {
        text: '请等待更新登录验证吗',
        collect: {
          key: 'fillCaptchaResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'showCaptcha' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
    ],
    waitShowNewCaptcha: [
      {
        text: '请等待更新登录验证吗',
        collect: {
          key: 'showCaptchaResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'showCaptcha' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
    ],
    waitFillAndSubmit: [
      {
        text: '请等待登录操作执行结果',
        collect: {
          key: 'fillSubmitResult',
          options: [
            {
              pattern: 'denglushibai',
              type: 'string',
              action: 'next',
            },
            {
              pattern: 'anquanchengnuo',
              type: 'string',
              action: 'next',
            },
            {
              pattern: 'dengluchenggong',
              type: 'string',
              action: 'guide',
            },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
      {
        channelData: {
          messageList: [
            {
              contentType: 'application/vnd.gsma.botmessage.v1.0+json',
              contentText: {
                message: {
                  generalPurposeCard: {
                    layout: {
                      cardOrientation: 'HORIZONTAL',
                      imageAlignment: 'LEFT',
                      titleFontStyle: ['underline', 'bold'],
                      descriptionFontStyle: ['calibri'],
                      style: 'http://example.com/default.css',
                    },
                    content: {
                      media: {
                        mediaUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        mediaContentType: 'image/png',
                        mediaFileSize: 2,
                        thumbnailUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        thumbnailContentType: 'image/png',
                        thumbnailFileSize: 1,
                        height: 'MEDIUM_HEIGHT',
                        contentDescription: '',
                      },
                      title: '登录执行结果',
                      suggestions: [
                        {
                          reply: {
                            displayText: '重新登录（若登录失败）',
                            postback: {
                              data: 'redo_fill_captcha',
                            },
                          },
                        },
                        {
                          reply: {
                            displayText: '【同意】安全承诺书（若出现）',
                            postback: {
                              data: 'do_click_agree',
                            },
                          },
                        },
                        {
                          reply: {
                            displayText: '下一步',
                            postback: {
                              data: 'do_guide',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
        collect: {
          key: 'glossary',
          options: [
            {
              pattern: 'redo_fill_captcha',
              type: 'string',
              action: 'waitShowNewCaptcha',
            },
            {
              pattern: 'do_click_agree',
              type: 'string',
              action: 'waitClickAgree',
            },
            {
              pattern: 'do_guide',
              type: 'string',
              action: 'guide',
            },
            { default: true, action: 'close' },
          ],
        },
        action: 'next',
      },
    ],
    waitClickAgree: [
      {
        text: '请等待【同意】操作执行结果',
        collect: {
          key: 'clickAgreeResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'guide' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
    ],
    guide: [
      {
        channelData: {
          messageList: [
            {
              contentType: 'application/vnd.gsma.botmessage.v1.0+json',
              contentText: {
                message: {
                  generalPurposeCard: {
                    layout: {
                      cardOrientation: 'HORIZONTAL',
                      imageAlignment: 'LEFT',
                      titleFontStyle: ['underline', 'bold'],
                      descriptionFontStyle: ['calibri'],
                      style: 'http://example.com/default.css',
                    },
                    content: {
                      media: {
                        mediaUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        mediaContentType: 'image/png',
                        mediaFileSize: 2,
                        thumbnailUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        thumbnailContentType: 'image/png',
                        thumbnailFileSize: 1,
                        height: 'MEDIUM_HEIGHT',
                        contentDescription: '',
                      },
                      title: '导航',
                      descriptionTemplate:
                        '指定要进入的页面。输入【close】退出应用。',
                      suggestions: [
                        {
                          reply: {
                            displayText: '进入【工作台】页',
                            postback: {
                              data: 'do_goto_workbench',
                            },
                          },
                        },
                        {
                          reply: {
                            displayText: '进入【日历】页',
                            postback: {
                              data: 'do_goto_calendar',
                            },
                          },
                        },
                        {
                          reply: {
                            displayText: '进入【日志】页',
                            postback: {
                              data: 'do_goto_effort',
                            },
                          },
                        },
                        {
                          reply: {
                            displayText: '新增日志',
                            postback: {
                              data: 'do_goto_addEffort',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
        collect: {
          key: 'glossary',
          options: [
            {
              pattern: 'do_goto_workbench',
              type: 'string',
              action: 'waitGotoWorkbench',
            },
            {
              pattern: 'do_goto_calendar',
              type: 'string',
              action: 'waitGotoZentaoCalendar',
            },
            {
              pattern: 'do_goto_effort',
              type: 'string',
              action: 'waitGotoZentaoEffort',
            },
            {
              pattern: 'do_goto_addEffort',
              type: 'string',
              action: 'waitGotoZentaoAddEffort',
            },
            {
              pattern: 'close',
              type: 'string',
              action: 'waitClose',
            },
            { default: true, action: 'close' },
          ],
        },
        action: 'next',
      },
    ],
    waitGotoWorkbench: [
      {
        text: '请等待进入【工作台】',
        collect: {
          key: 'gotoWorkbenchResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'next' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
      {
        channelData: {
          messageList: [
            {
              contentType: 'application/vnd.gsma.botmessage.v1.0+json',
              contentText: {
                message: {
                  generalPurposeCard: {
                    layout: {
                      cardOrientation: 'HORIZONTAL',
                      imageAlignment: 'LEFT',
                      titleFontStyle: ['underline', 'bold'],
                      descriptionFontStyle: ['calibri'],
                      style: 'http://example.com/default.css',
                    },
                    content: {
                      media: {
                        mediaUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        mediaContentType: 'image/png',
                        mediaFileSize: 2,
                        thumbnailUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        thumbnailContentType: 'image/png',
                        thumbnailFileSize: 1,
                        height: 'MEDIUM_HEIGHT',
                        contentDescription: '',
                      },
                      title: '工作台',
                      descriptionTemplate: '输入【close】退出应用。',
                      suggestions: [
                        {
                          reply: {
                            displayText: '回到导航',
                            postback: {
                              data: 'do_guide',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
        collect: {
          key: 'glossary',
          options: [
            {
              pattern: 'do_guide',
              type: 'string',
              action: 'guide',
            },
            {
              pattern: 'close',
              type: 'string',
              action: 'waitClose',
            },
            { default: true, action: 'close' },
          ],
        },
        action: 'next',
      },
    ],
    waitGotoZentaoCalendar: [
      {
        text: '请等待进入【日历】页',
        collect: {
          key: 'gotoZentaoResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'waitGotoCalendar' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
    ],
    waitGotoCalendar: [
      {
        text: '请等待进入【日历】页',
        collect: {
          key: 'gotoCalendarResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'next' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
      {
        channelData: {
          messageList: [
            {
              contentType: 'application/vnd.gsma.botmessage.v1.0+json',
              contentText: {
                message: {
                  generalPurposeCard: {
                    layout: {
                      cardOrientation: 'HORIZONTAL',
                      imageAlignment: 'LEFT',
                      titleFontStyle: ['underline', 'bold'],
                      descriptionFontStyle: ['calibri'],
                      style: 'http://example.com/default.css',
                    },
                    content: {
                      media: {
                        mediaUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        mediaContentType: 'image/png',
                        mediaFileSize: 2718288,
                        thumbnailUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        thumbnailContentType: 'image/png',
                        thumbnailFileSize: 314159,
                        height: 'MEDIUM_HEIGHT',
                        contentDescription: '',
                      },
                      title: '日历',
                      suggestions: [
                        {
                          reply: {
                            displayText: '回到导航',
                            postback: {
                              data: 'do_guide',
                            },
                          },
                        },
                        {
                          reply: {
                            displayText: '新增日志',
                            postback: {
                              data: 'do_add_effort',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
        collect: {
          key: 'glossary',
          options: [
            {
              pattern: 'do_guide',
              type: 'string',
              action: 'guide',
            },
            {
              pattern: 'do_add_effort',
              type: 'string',
              action: 'waitAddEffort',
            },
            { default: true, action: 'close' },
          ],
        },
        action: 'next',
      },
    ],
    waitGotoZentaoEffort: [
      {
        text: '请等待进入【日志】页',
        collect: {
          key: 'gotoZentaoResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'waitGotoEffort' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
    ],
    waitGotoEffort: [
      {
        text: '请等待进入【日志】页',
        collect: {
          key: 'gotoCalendarResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'next' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
      {
        channelData: {
          messageList: [
            {
              contentType: 'application/vnd.gsma.botmessage.v1.0+json',
              contentText: {
                message: {
                  generalPurposeCard: {
                    layout: {
                      cardOrientation: 'HORIZONTAL',
                      imageAlignment: 'LEFT',
                      titleFontStyle: ['underline', 'bold'],
                      descriptionFontStyle: ['calibri'],
                      style: 'http://example.com/default.css',
                    },
                    content: {
                      media: {
                        mediaUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        mediaContentType: 'image/png',
                        mediaFileSize: 2,
                        thumbnailUrlTemplate:
                          '{{{vars.TMS_PUPPETEER_RESULT.screenshot.url}}}',
                        thumbnailContentType: 'image/png',
                        thumbnailFileSize: 1,
                        height: 'MEDIUM_HEIGHT',
                        contentDescription: '',
                      },
                      title: '日志',
                      descriptionTemplate: '输入【close】退出应用。',
                      suggestions: [
                        {
                          reply: {
                            displayText: '回到导航',
                            postback: {
                              data: 'do_guide',
                            },
                          },
                        },
                        {
                          reply: {
                            displayText: '新增日志',
                            postback: {
                              data: 'do_add_effort',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
        collect: {
          key: 'glossary',
          options: [
            {
              pattern: 'do_guide',
              type: 'string',
              action: 'guide',
            },
            {
              pattern: 'do_add_effort',
              type: 'string',
              action: 'waitAddEffort',
            },
            {
              pattern: 'close',
              type: 'string',
              action: 'waitClose',
            },
            { default: true, action: 'close' },
          ],
        },
        action: 'next',
      },
    ],
    waitGotoZentaoAddEffort: [
      {
        text: '请等待开始新增日志',
        collect: {
          key: 'GotoZentaoAddEffortResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'waitAddEffort' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
    ],
    waitAddEffort: [
      {
        text: '请等待获取项目信息',
        collect: {
          key: 'addEffort',
          options: [
            {
              pattern: 'ok',
              type: 'string',
              action: 'collectEffortProductId',
            },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
    ],
    collectEffortProductId: [
      {
        channelData: {
          messageList: [
            {
              contentType: 'text/plain',
              contentTextTemplate:
                '{{#each vars.TMS_PUPPETEER_RESULT.http}}{{#unless @first}} ; {{/unless}}{{name}}: {{id}}{{/each}}',
            },
          ],
        },
      },
      {
        channelData: {
          messageList: [
            {
              contentType: 'text/plain',
              contentText: '请选择或输入项目id',
            },
            {
              contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
              contentText: {
                suggestionsTemplate:
                  '[{{#each vars.TMS_PUPPETEER_RESULT.http}}{{#unless @first}},{{/unless}}{ "reply": { "displayText": "{{id}}", "postback": { "data": "{{id}}" } } }{{/each}}]',
              },
            },
          ],
        },
        collect: {
          key: 'expectProductId',
        },
        action: 'next',
      },
      {
        action: 'collectEffortDate',
      },
    ],
    collectEffortDate: [
      {
        channelData: {
          messageList: [
            {
              contentType: 'text/plain',
              contentText:
                '请选择【工作日】或输入对应【日期】，例如：2022-11-11',
            },
            {
              contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
              contentText: {
                suggestionsTemplate:
                  '[{{#each vars.weekWorkdays}}{{#unless @first}},{{/unless}}{ "reply": { "displayText": "{{text}}", "postback": { "data": "{{value}}" } } }{{/each}}]',
              },
            },
          ],
        },
        collect: {
          key: 'expectDate',
        },
        action: 'next',
      },
      {
        action: 'collectEfforWork',
      },
    ],
    collectEfforWork: [
      {
        text: '请输入【工作内容】',
        collect: {
          key: 'expectWork',
        },
        action: 'next',
      },
      {
        action: 'collectEffortConsumed',
      },
    ],
    collectEffortConsumed: [
      {
        channelData: {
          messageList: [
            {
              contentType: 'text/plain',
              contentText: '请输入【耗时（小时）】或直接选择',
            },
            {
              contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
              contentText: {
                suggestions: [
                  {
                    reply: {
                      displayText: '1小时',
                      postback: {
                        data: '1',
                      },
                    },
                  },
                  {
                    reply: {
                      displayText: '2小时',
                      postback: {
                        data: '2',
                      },
                    },
                  },
                  {
                    reply: {
                      displayText: '4小时',
                      postback: {
                        data: '4',
                      },
                    },
                  },
                  {
                    reply: {
                      displayText: '8小时',
                      postback: {
                        data: '8',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        collect: {
          key: 'expectConsumed',
        },
        action: 'next',
      },
      {
        action: 'confirmCollectEffort',
      },
    ],
    confirmCollectEffort: [
      {
        channelData: {
          messageList: [
            {
              contentType: 'text/plain',
              contentTextTemplate:
                '项目id={{vars.expectProductId}}，工作日={{vars.expectDate}}，工作内容={{vars.expectWork}}，消耗小时={{vars.expectConsumed}}。',
            },
            {
              contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
              contentText: {
                suggestions: [
                  {
                    reply: {
                      displayText: '提交',
                      postback: {
                        data: 'yes',
                      },
                    },
                  },
                  {
                    reply: {
                      displayText: '返回导航',
                      postback: {
                        data: 'guide',
                      },
                    },
                  },
                  {
                    reply: {
                      displayText: '退出应用',
                      postback: {
                        data: 'close',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        collect: {
          key: 'confirmSubmitEffort',
          options: [
            {
              pattern: 'yes|是',
              type: 'string',
              action: 'waitSubmitEffort',
            },
            {
              pattern: 'close',
              type: 'string',
              action: 'close',
            },
            { default: true, action: 'guide' },
          ],
        },
        action: 'next',
      },
    ],
    waitSubmitEffort: [
      {
        text: '等待新增日志提交结果',
        collect: {
          key: 'submitEffortResult',
          options: [
            { pattern: 'ok', type: 'string', action: 'next' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
      {
        channelData: {
          messageList: [
            {
              contentType: 'text/plain',
              contentTextTemplate: '继续新增日志？',
            },
            {
              contentType: 'application/vnd.gsma.botsuggestion.v1.0+json',
              contentText: {
                suggestions: [
                  {
                    reply: {
                      displayText: '继续',
                      postback: {
                        data: 'yes',
                      },
                    },
                  },
                  {
                    reply: {
                      displayText: '查看日志',
                      postback: {
                        data: 'goto_effort',
                      },
                    },
                  },
                  {
                    reply: {
                      displayText: '查看日历',
                      postback: {
                        data: 'goto_calendar',
                      },
                    },
                  },
                  {
                    reply: {
                      displayText: '退出',
                      postback: {
                        data: 'goto_close',
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
        collect: {
          key: 'confirmSubmitEffort',
          options: [
            {
              pattern: 'yes|是',
              type: 'string',
              action: 'waitAddEffort',
            },
            {
              pattern: 'goto_effort',
              type: 'string',
              action: 'waitGotoZentaoEffort',
            },
            {
              pattern: 'goto_calendar',
              type: 'string',
              action: 'waitGotoZentaoCalendar',
            },
            {
              pattern: 'goto_close',
              type: 'string',
              action: 'close',
            },
            { default: true, action: 'guide' },
          ],
        },
        action: 'next',
      },
    ],
    close: [
      {
        text: '请输入【close】关闭应用，其它任意内容返回导航',
        collect: {
          key: 'expectClose',
          options: [
            { pattern: 'close', type: 'string', action: 'waitClose' },
            { default: true, action: 'guide' },
          ],
        },
        action: 'next',
      },
    ],
    waitClose: [
      {
        text: '请等待【关闭】操作执行结果',
        collect: {
          key: 'closeResult',
          options: [
            { pattern: 'closed', type: 'string', action: 'finish' },
            { default: true, action: 'repeat' },
          ],
        },
        action: 'next',
      },
    ],
    finish: [{ text: '结束！若需要再次操作，请输入【gongshi】激活' }],
  },
}

describe('简单定义生成表单节点', () => {
  it('构造表单节点', () => {
    const editDoc = new DocAsArray(SampleData)
    const fieldNames: string[] = []
    build(
      {
        schema: SampleSchema,
        editDoc,
        onMessage: (msg: string) => {
          console.log(msg)
        },
      },
      fieldNames
    )
    // console.log(fieldNames)
    // editDoc.appendAt(
    //   'data.before',
    //   { handler: { name: 'GenericAPIHandler' } },
    //   'xyz'
    // )
    // console.log(JSON.stringify(editDoc.properties, null, 2))
    // editDoc.rename('data.before.xyz', 'xyz1')
    // console.log(JSON.stringify(editDoc.properties, null, 2))
    // expect(fieldNames).toHaveLength(5)
    // expect(fieldNames[0]).toBe('name')
    // expect(fieldNames[1]).toBe('agree')
    // expect(fieldNames[2]).toBe('tel.areaCode')
    // expect(fieldNames[3]).toBe('tel.phoneNumber')
    // expect(fieldNames[4]).toBe('tel')
    // console.log(JSON.stringify(editDoc.build(SampleSchema, true), null, 2))
    console.log(editDoc.names())
    console.log(JSON.stringify(editDoc.build(SampleSchema, true), null, 2))
  })
})
