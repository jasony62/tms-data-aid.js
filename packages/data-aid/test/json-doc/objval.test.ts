import { DocAsArray } from '@/json-doc/model'

describe('属性值是对象的处理', () => {
  it('在文档上追加包含默认值的对象', () => {
    const rawDoc = {
      generalPurposeCard: {},
    }
    const doc = new DocAsArray(rawDoc)
    expect(doc.names()).toEqual(['', 'generalPurposeCard'])
    // 追加对象
    doc.appendAt(
      'generalPurposeCard',
      {
        cardOrientation: 'HORIZONTAL',
        imageAlignment: 'LEFT',
      },
      'layout'
    )
    expect(doc.names()).toEqual([
      '',
      'generalPurposeCard',
      'generalPurposeCard.layout',
      'generalPurposeCard.layout.cardOrientation',
      'generalPurposeCard.layout.imageAlignment',
    ])
  })
  it('在文档上设置属性的值，值为对象', () => {
    const rawDoc = {
      generalPurposeCard: {
        layout: {},
      },
    }
    const doc = new DocAsArray(rawDoc)
    expect(doc.names()).toEqual([
      '',
      'generalPurposeCard',
      'generalPurposeCard.layout',
    ])
    // 追加对象
    doc.set('generalPurposeCard.layout', {
      cardOrientation: 'HORIZONTAL',
      imageAlignment: 'LEFT',
    })
    expect(doc.names()).toEqual([
      '',
      'generalPurposeCard',
      'generalPurposeCard.layout',
      'generalPurposeCard.layout.cardOrientation',
      'generalPurposeCard.layout.imageAlignment',
    ])
    expect(doc.get('generalPurposeCard')).toMatchObject({
      layout: {
        cardOrientation: 'HORIZONTAL',
        imageAlignment: 'LEFT',
      },
    })
    expect(doc.get('generalPurposeCard.layout')).toMatchObject({
      cardOrientation: 'HORIZONTAL',
      imageAlignment: 'LEFT',
    })
    expect(doc.get('generalPurposeCard.layout.cardOrientation')).toBe(
      'HORIZONTAL'
    )
    expect(doc.get('generalPurposeCard.layout.imageAlignment')).toBe('LEFT')
  })
})
