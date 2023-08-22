import { SchemaIter, RawSchema, SchemaProp, DEFAULT_ROOT_NAME } from './model'

import Debug from 'debug'
const debug = Debug('json-schema:builder')

export { SchemaProp }
/**
 * 属性格式
 */
export const Type2Format = {
  string: [
    { value: 'name', label: '姓名' },
    { value: 'email', label: '邮箱' },
    { value: 'mobile', label: '手机' },
    { value: 'dateTime', label: '日期时间' },
    { value: 'longtext', label: '长文本' },
    { value: 'password', label: '密码' },
    { value: 'idcard', label: '身份证' },
    { value: 'handlebars', label: 'Handlebars模板' },
  ],
  object: [
    { value: 'file', label: '文件' },
    { value: 'image', label: '图片' },
    { value: 'url', label: '链接' },
    { value: 'score', label: '打分' },
  ],
} as { [k: string]: { value: string; label: string }[] }

const propToRaw = (prop: SchemaProp, parent: any): any => {
  let {
    items,
    lookup,
    existIf,
    isOneOf,
    isOneOfInclusiveGroup,
    isOneOfExclusiveGroup,
  } = prop

  let rawProp: any = {
    ...prop.attrs,
  }

  if (items) rawProp.items = items

  if (lookup) rawProp.lookup = lookup

  if (existIf) rawProp.existIf = existIf

  if (isOneOf) rawProp.isOneOf = isOneOf

  if (isOneOfInclusiveGroup)
    rawProp.isOneOfInclusiveGroup = isOneOfInclusiveGroup

  if (isOneOfExclusiveGroup)
    rawProp.isOneOfExclusiveGroup = isOneOfExclusiveGroup

  return rawProp
}
/**
 * JSONSchema构造器
 */
export class JSONSchemaBuilder {
  props: SchemaProp[]

  private _rootName

  constructor(rootName = DEFAULT_ROOT_NAME) {
    this.props = []
    this._rootName = rootName
  }

  get rootName() {
    return this._rootName
  }
  /**
   * 将JSONSchema对象变为数组
   */
  flatten(root: RawSchema): JSONSchemaBuilder {
    const iter = new SchemaIter(root, this.rootName)
    this.props = Array.from(iter)
    return this
  }
  /**
   * 生成JSONSchema对象
   * 只有简单类型的属性有默认值，需求清除在父属性上记录的默认值
   */
  unflatten() {
    if (this.props.length === 0) throw Error('[props]为空，无法进行数据转换')

    const root = this.props[0]
    if (root.name !== this.rootName && root.path !== '')
      throw Error('[props]第1个节点不是根节点，无法进行数据转换')

    // 处理根节点/
    const rootObj = propToRaw(root, null)
    if (rootObj.hasOwnProperty('default')) delete rootObj.default

    for (let i = 1; i < this.props.length; i++) {
      let prop = this.props[i]

      /**
       * 在对象查找或创建父节点。子属性总是在父属性的properties字段中
       */
      let { path, name } = prop
      if (!name) {
        alert(`第【${i}】个属性定义，键值不允许为空`)
        throw Error(`第【${i}】个属性定义，键值不允许为空`)
      }
      if (prop.isPattern && !/\^.+\$/.test(name)) {
        alert('正则表达式类型的键值必须以"^"开头,"$"结尾')
        throw Error('正则表达式类型的键值格式不正确')
      }
      // 将数组类型分为两次查找
      let pathsegs = path.replace(/\[\*\]/g, '.[*]').split('.')
      let parent = pathsegs.reduce((prev, seg) => {
        // 跳过根节点
        if (seg === this.rootName) {
          return prev
        }
        // 父节点是数组类型，子节点加到父节点的items字段
        if (seg === '[*]') {
          if (typeof prev.items === 'undefined') {
            prev.items = {}
          }
          return prev.items
        }
        // 分开处理properties和patternProperties
        if (/\^.+\$/.test(seg)) {
          if (typeof prev.patternProperties === 'undefined') {
            prev.patternProperties = { [seg]: {} }
          } else if (typeof prev.patternProperties[seg] === 'undefined') {
            prev.patternProperties[seg] = {}
          }
          return prev.patternProperties[seg]
        } else {
          // 子节点加到父节点的properties字段中
          if (typeof prev.properties === 'undefined') {
            prev.properties = { [seg]: {} }
          } else if (typeof prev.properties[seg] === 'undefined') {
            prev.properties[seg] = {}
          }
          return prev.properties[seg]
        }
      }, rootObj)

      /**在父对象中添加当前属性 */
      let newProp = propToRaw(prop, parent)
      if (newProp.type === 'object' || newProp.type === 'array') {
        if (newProp.hasOwnProperty('default')) delete newProp.default
      }
      /**加入父属性 */
      if (typeof prop.isPattern === 'boolean' && prop.isPattern === true) {
        if (typeof parent.patternProperties === 'undefined')
          parent.patternProperties = {}
        parent.patternProperties[name] = newProp
      } else {
        if (typeof parent.properties === 'undefined') parent.properties = {}
        parent.properties[name] = newProp
      }
    }

    return rootObj
  }
  /**
   * 根据名称返回匹配的属性
   * @param name 指定的属性名称
   */
  get(fullname: string) {
    return this.props.find((prop) => prop.fullname === fullname)
  }
  /**
   * 返回指定节点的父节点
   */
  getParent(prop: SchemaProp): SchemaProp | undefined {
    return this.props.find((other) => {
      return (
        other.fullname === prop.path ||
        other.fullname === prop.path.replace(/\[\*\]$/, '')
      )
    })
  }
  /**
   * 获得属性的全局索引
   */
  getIndex(prop: SchemaProp): number {
    return this.props.findIndex((other) => other.fullname === prop.fullname)
  }
  /**
   * 获得属性最后一个后代属性的全局索引
   * 如果没有后代属性，返回-1
   */
  getEndIndex(prop: SchemaProp): number {
    let lastIndex = -1

    let propIndex = this.getIndex(prop)
    // 根属性，最后一个属性的索引或失败
    if (propIndex === 0) return this.props.length - 1 || -1

    const { fullname } = prop
    let child
    for (let i = propIndex + 1; i < this.props.length; i++) {
      child = this.props[i]
      if (child.path.indexOf(fullname) === 0) lastIndex = i
    }

    return lastIndex
  }
  /**
   * 获得属性的前一个兄弟属性的全局索引
   * @param prop
   */
  getPrevSiblingIndex(prop: SchemaProp): number {
    /**path一样的就是兄弟属性。最远找到父节点结束。*/
    const index = this.getIndex(prop)
    if (index === -1) return -1 // 没有找到指定的属性

    let siblingIndex = -1
    for (let i = index - 1; i > 0; i--) {
      if (this.props[i].path === prop.path) {
        siblingIndex = i
        break
      } else if (
        this.props[i].fullname === prop.path ||
        this.props[i] + '[*]' === prop.path
      ) {
        // 已经到达父节点
        break
      }
    }

    return siblingIndex
  }
  /**
   * 获得属性的后一个兄弟属性的全局索引
   * @param prop
   */
  getNextSiblingIndex(prop: SchemaProp): number {
    /**path一样的就是兄弟属性。最远找到父节点结束。*/
    const index = this.getIndex(prop)
    if (index === -1) return -1 // 没有找到指定的属性

    let siblingIndex = -1
    for (let i = index + 1; i < this.props.length; i++) {
      if (this.props[i].path === prop.path) {
        siblingIndex = i
        break
      } else if (this.props[i].path.indexOf(prop.path) !== 0) {
        break
      }
    }

    return siblingIndex
  }
  /**
   * 是否可以在属性前添加兄弟属性
   * @param prop
   * @returns
   */
  canAddBefore(prop: SchemaProp): boolean {
    if (prop === this.props[0]) return false
    return true
  }
  /**
   * 是否可以在属性后添加兄弟属性
   * @param prop
   * @returns
   */
  canAddAfter(prop: SchemaProp): boolean {
    if (prop === this.props[0]) return false
    return true
  }
  /**
   * 属性是否可以向前移动位置
   * @param prop
   */
  canMoveUp(prop: SchemaProp): boolean {
    const siblingIndex = this.getPrevSiblingIndex(prop)
    return siblingIndex > 0
  }
  /**
   * 属性是否可以向后移动
   */
  canMoveDown(prop: SchemaProp): boolean {
    const siblingIndex = this.getNextSiblingIndex(prop)
    return siblingIndex > 0
  }
  /**
   * 属性是否允许删除
   */
  canRemove(prop: SchemaProp): boolean {
    if (prop === this.props[0]) return false
    let lastChildIndex = this.getEndIndex(prop)
    if (lastChildIndex !== -1) return false

    return true
  }
  /**
   * 在指定的属性下添加定义
   * 需满足如下条件：
   * 1、指定属性的类型必须是object，或者，类型是array且子项目的类型是object
   * 2、属性下没有属性
   *
   * @param prop 指定的属性
   * @returns
   */
  canAddJSONSchema(prop: SchemaProp): boolean {
    if (this.getEndIndex(prop) !== -1) {
      debug(`属性【${prop.fullname}】有子属性，不能添加定义`)
      return false
    }
    if (prop.attrs.type !== 'object' && prop.attrs.type !== 'arry') {
      debug(`属性【${prop.fullname}】的类型不是对象或数组，不能添加定义`)
      return false
    }
    if (prop.attrs.type === 'arry' && prop.items?.type !== 'object') {
      debug(`属性【${prop.fullname}】的子项目类型不是对象，不能添加定义`)
      return false
    }

    return true
  }
  /**
   * 在指定的属性下添加子属性
   * 如果父属性的类型是数组，那么，新属性的path等于父属性的fullname+[*]
   */
  addProp(parent: SchemaProp, type: string = 'properties'): SchemaProp {
    // 节点所在路径
    let path = parent.fullname
    if (parent.attrs.type === 'array') path += '[*]'

    let newProp = new SchemaProp(path, 'newKey', 'string')
    newProp.isPattern = type === 'patternProperties' ? true : false

    /**将新节点加入到适当位置*/
    let lastIndex = this.getEndIndex(parent)
    if (lastIndex !== -1) {
      // 作为最后1个子节点
      this.props.splice(lastIndex + 1, 0, newProp)
    } else {
      // 父节点下的第1个节点
      let parentIndex = this.props.indexOf(parent)
      this.props.splice(parentIndex + 1, 0, newProp)
    }

    return newProp
  }
  /**
   * 在指定的属性下添加属性定义
   * 必须满足添加条件
   *
   * @param parent 指定的属性
   * @param rawSchema
   * @returns 添加的数量
   */
  addJSONSchema(parent: SchemaProp, rawSchema: RawSchema): SchemaProp[] {
    if (!this.canAddJSONSchema(parent)) return []

    /**解析属性定义*/
    const builder = new JSONSchemaBuilder(parent.fullname)
    builder.flatten(rawSchema)
    let newProps = builder.props
    if (newProps.length <= 1) return []

    /**去掉根属性，与指定属性合并*/
    let newRootProp = newProps.shift()
    Object.assign(parent.attrs, newRootProp?.attrs)
    if (newRootProp?.items) parent.items = newRootProp.items

    /**添加子定义的位置*/
    let index = this.getIndex(parent) + 1
    debug(`属性【${parent.fullname}】在存储位置【${index}】添加子定义`)
    this.props.splice(index, 0, ...newProps)

    return newProps
  }
  /**
   * 在指定属性前添加兄弟属性
   * @param sibling
   */
  addPropBefore(sibling: SchemaProp): SchemaProp | undefined {
    if (!this.canAddBefore(sibling)) return undefined

    const index = this.getIndex(sibling)

    let newProp = new SchemaProp(sibling.path, 'newKey', 'string')
    newProp.isPattern = sibling.isPattern

    this.props.splice(index, 0, newProp)

    return newProp
  }
  /**
   * 在指定属性后添加兄弟属性
   * @param sibling
   */
  addPropAfter(sibling: SchemaProp): SchemaProp | undefined {
    if (!this.canAddAfter(sibling)) return undefined

    // 新兄弟属性插入位置
    let index = this.getEndIndex(sibling)
    if (index <= 0) {
      index = this.getIndex(sibling)
      if (index <= 0) return undefined
    }
    let newProp = new SchemaProp(sibling.path, 'newKey', 'string')
    newProp.isPattern = sibling.isPattern

    this.props.splice(index + 1, 0, newProp)

    return newProp
  }
  /**
   * 删除指定的属性
   *
   * 根节点不允许删除
   */
  removeProp(prop: SchemaProp): SchemaProp | boolean {
    if (!this.canRemove(prop)) return false

    let index = this.props.indexOf(prop)
    if (index <= 0) return false

    let prev = this.props[index - 1]
    this.props.splice(index, 1)

    return prev
  }
  /**
   * 向前移动属性位置
   * @param prop
   */
  moveUp(prop: SchemaProp) {
    const siblingIndex = this.getPrevSiblingIndex(prop)
    if (siblingIndex < 0) return false

    /**确定要移动的范围。属性及其子属性*/
    // 移动的起始位置
    const index = this.getIndex(prop)
    const lastIndex = this.getEndIndex(prop)
    // 要移动属性的数量
    const number = lastIndex === -1 ? 1 : lastIndex - index + 1

    // 向前移动
    const { props } = this
    const moved = props.splice(index, number)
    // 要移动到的位置
    props.splice(siblingIndex, 0, ...moved)

    return true
  }
  /**
   * 向后移动属性位置
   * @param prop
   * @returns
   */
  moveDown(prop: SchemaProp) {
    const siblingIndex = this.getNextSiblingIndex(prop)
    if (siblingIndex < 0) return false

    // 当前节点在全局数组中的位置
    const index = this.getIndex(prop)
    const lastIndex = this.getEndIndex(prop)
    // 要移动属性的数量
    const number = lastIndex === -1 ? 1 : lastIndex - index + 1

    // 向后移动
    const { props } = this
    const moved = props.splice(index, number)

    props.splice(siblingIndex, 0, ...moved)

    return true
  }
  /**
   * 返回所有属性的fullname
   */
  fullnames() {
    return this.props.map((p) => p.fullname)
  }
}
