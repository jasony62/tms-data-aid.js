import { DocIter, DocAsArray } from '@/json-doc/model'

describe('文档迭代器', () => {
  // it('执行迭代', () => {
  //   const doc = {
  //     name: 'doc001',
  //     title: '文档001',
  //     content: { type: 'text', body: 'hello' },
  //     children: [
  //       {
  //         name: 'doc001_0',
  //         title: '文档001_0',
  //         content: { type: 'image', body: 'aaabbb' },
  //       },
  //     ],
  //   }
  //   const iter = new DocIter(doc)
  //   const props = Array.from(iter)

  //   console.log(props)
  // })
  // it('追加方式构造对象', () => {
  //   const builder = new DocAsArray()
  //   builder.append('name', 'doc001')
  //   builder.append('title', '文档001')
  //   builder.append('content.type', 'text')
  //   builder.append('content.body', 'hello')
  //   builder.append('children[0].name', 'doc001_0')
  //   builder.append('children[0].title', '文档001_0')
  //   builder.append('children[0].content.type', 'image')
  //   builder.append('children[0].content.body', 'aaabbb')
  //   const obj = builder.build()
  //   console.log(JSON.stringify(obj, null, 2))
  // })
  // it('指定位置添加方式构造对象', () => {
  //   const builder = new DocAsArray()
  //   builder.appendAt('', 'doc001', 'name')
  //   builder.appendAt('', '文档001', 'title')
  //   builder.appendAt('', {}, 'content')
  //   builder.appendAt('content', 'text', 'type')
  //   builder.appendAt('content', 'hello', 'body')
  //   builder.appendAt('content', [], 'children')
  //   builder.appendAt('content.children', {}, 0)
  //   builder.appendAt('content.children[0]', 'doc001_0', 'name')
  //   builder.appendAt('content.children[0]', '文档001_0', 'title')
  //   builder.appendAt('content.children[0]', {}, 'content')
  //   builder.appendAt('content.children[0].content', 'image', 'type')
  //   builder.appendAt('content.children[0].content', 'aaabbb', 'body')

  //   console.log(JSON.stringify(builder._properties, null, 2))
  //   const obj = builder.build()
  //   console.log(JSON.stringify(obj, null, 2))
  // })
  // it('操作数组对象，删除', () => {
  //   const doc = {
  //     additionalName: ['alice', 'bob'],
  //   }
  //   const builder = new DocAsArray(doc)
  //   builder.remove('additionalName[0]')

  //   console.log(JSON.stringify(builder._properties, null, 2))
  //   //const obj = builder.build()
  //   //console.log(JSON.stringify(obj, null, 2))
  // })
  // it('操作数组对象，删除', () => {
  //   const doc = {
  //     experiences: [{ time: '2001' }, { time: '2002' }],
  //   }

  //   const builder = new DocAsArray(doc)
  //   builder.remove('experiences[0]')
  //   console.log(JSON.stringify(builder._properties, null, 2))

  //   //const obj = builder.build()
  //   //console.log(JSON.stringify(obj, null, 2))
  // })
  // it('修改用户定义属性名称', () => {
  //   const doc = {
  //     org: {
  //       name: '研发部',
  //       strProduct: 'tms-vue3-kit',
  //       'str in valid': '123',
  //       objAbc: {
  //         label: 'aaa',
  //         value: '111',
  //         extra: { label: 'aaa_bbb', value: '111_222' },
  //       },
  //       objXyz: {
  //         label: 'xxx',
  //         value: '999',
  //         extra: { label: 'xxx_yyy', value: '999_888' },
  //       },
  //     },
  //   }

  //   const builder = new DocAsArray(doc)
  //   // builder.rename('org.strProduct', 'strProduct1')
  //   // console.log(JSON.stringify(builder._properties, null, 2))
  //   // builder.rename('org.strProduct1', 'strProduct12')
  //   // console.log(JSON.stringify(builder._properties, null, 2))
  //   builder.remove('org.objXyz.extra')
  //   console.log(JSON.stringify(builder._properties, null, 2))
  //   //const obj = builder.build()
  //   //console.log(JSON.stringify(obj, null, 2))
  // })
  // it('修改文档对象', () => {
  //   const doc = {}
  //   const builder = new DocAsArray(doc)
  //   let key, value
  //   // 默认存在根节点
  //   let names = builder.names()
  //   expect(names).toHaveLength(1)
  //   expect(names[0]).toBe('')
  //   /**
  //    * 添加简单类型子属性
  //    */
  //   key = 'name'
  //   value = 'test'
  //   builder.appendAt('', value, key)
  //   names = builder.names()
  //   expect(names).toHaveLength(2)
  //   expect(names[1]).toBe('name')
  //   /**
  //    * 添加对象类型子属性
  //    */
  //   key = 'contact'
  //   value = { mobile: '18910001111', email: 'test@189.cn' }
  //   builder.appendAt('', value, key)
  //   names = builder.names()
  //   expect(names).toHaveLength(5)
  //   expect(names[2]).toBe('contact')
  //   expect(names[3]).toBe('contact.mobile')
  //   expect(names[4]).toBe('contact.email')
  //   /**
  //    * 添加数组类型子属性，数组项目是简单类型
  //    */
  //   key = 'language'
  //   value = ['c', 'javascript', 'java', 'php', 'go']
  //   builder.appendAt('', value, key)
  //   names = builder.names()
  //   expect(names).toHaveLength(11)
  //   expect(names[5]).toBe('language')
  //   expect(names[6]).toBe('language[0]')
  //   expect(names[7]).toBe('language[1]')
  //   expect(names[8]).toBe('language[2]')
  //   expect(names[9]).toBe('language[3]')
  //   expect(names[10]).toBe('language[4]')
  //   /**
  //    * 添加数组类型子属性，数组项目是对象
  //    */
  //   key = 'experience'
  //   value = [
  //     { job: 'pm', month: '120' },
  //     { job: 'coder', month: 360 },
  //     { job: 'product', month: '120' },
  //   ]
  //   builder.appendAt('', value, key)
  //   names = builder.names()
  //   expect(names).toHaveLength(21)
  //   expect(names[11]).toBe('experience')
  //   expect(names[12]).toBe('experience[0]')
  //   expect(names[13]).toBe('experience[0].job')
  //   expect(names[14]).toBe('experience[0].month')
  //   expect(names[15]).toBe('experience[1]')
  //   expect(names[16]).toBe('experience[1].job')
  //   expect(names[17]).toBe('experience[1].month')
  //   expect(names[18]).toBe('experience[2]')
  //   expect(names[19]).toBe('experience[2].job')
  //   expect(names[20]).toBe('experience[2].month')
  //   /**
  //    * 向前移动数组中的项目，简单类型
  //    */
  //   builder.moveUp('language[2]')
  //   /**
  //    * 向前移动数组中的项目，对象类型
  //    */
  //   builder.moveUp('experience[1]')
  //   /**
  //    * 向后移动数组中的项目，简单类型
  //    */
  //   builder.moveDown('language[2]')
  //   /**
  //    * 向后移动数组中的项目，对象类型
  //    */
  //   builder.moveDown('experience[1]')

  //   console.log(builder.build())
  // })
  // it('移动可选属性在父属性中的位置', () => {
  //   const doc = {
  //     org: {
  //       name: '研发部',
  //       strProduct: 'tms-vue3-kit',
  //       objAbc: {
  //         label: 'aaa',
  //         value: '111',
  //         extra: {
  //           label: 'aaa_bbb',
  //           value: '111_222',
  //         },
  //       },
  //       objXyz: {
  //         label: 'xxx',
  //         value: '999',
  //         extra: {
  //           label: 'xxx_yyy',
  //           value: '999_888',
  //         },
  //       },
  //     },
  //   }
  //   const builder = new DocAsArray(doc)
  //   builder.moveUp('org.strProduct')
  //   builder.moveDown('org.objAbc')
  //   console.log(builder.build())
  // })
  it('清除空字段', () => {
    const doc = {
      org: {
        name: '研发部',
        strProduct: '',
        objAbc: {
          label: 'aaa',
          value: '111',
          extra: {
            label: '',
            value: '111_222',
          },
        },
        objXyz: {
          label: 'xxx',
          value: '',
          extra: {
            label: 'xxx_yyy',
            value: '999_888',
          },
        },
        emptyArray: [],
        emptyArrayNest: [{ name: '' }],
        emptyObject: {},
        emptyNestObject: { child: {} },
      },
    }
    const builder = new DocAsArray(doc)
    //builder.cleanEmpty()
    console.log(JSON.stringify(builder.build(undefined, true), null, 2))
  })
})
