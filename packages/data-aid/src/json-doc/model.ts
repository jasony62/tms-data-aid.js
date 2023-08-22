import _set from 'lodash.set'
import Debug from 'debug'
import { RawSchema, SchemaIter, SchemaProp } from '@/json-schema/model'

const debug = Debug('json-doc:model')

/**
 * 解析数组
 * @param parent
 */
function* _parseArray(parent: DocProp): any {
  let rawArr = parent.value
  for (let i = 0; i < rawArr.length; i++) {
    let value = rawArr[i]
    let prop = new DocProp(parent, i, value)
    yield prop
    if (Array.isArray(value)) {
      yield* _parseArray(prop)
    } else if (value !== null && typeof value === 'object') {
      yield* _pasrseObj(prop)
    }
  }
}
/**
 * 解析对象
 * @param parent
 */
function* _pasrseObj(parent: DocProp): any {
  let rawObj = parent.value
  if (rawObj === null) return
  let keys = Object.keys(rawObj)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    let value = rawObj[key]
    let prop = new DocProp(parent, key, value)
    yield prop
    if (Array.isArray(value)) {
      yield* _parseArray(prop)
    } else if (value !== null && typeof value === 'object') {
      yield* _pasrseObj(prop)
    }
  }
}

/**
 * 根节点默认名称
 */
export const DEFAULT_ROOT_NAME = ''
/**
 * 文档对象迭代器。
 * 不包含根对象
 */
export class DocIter {
  _rawDoc
  _rootName: string
  _rootProp: DocProp | null

  constructor(rawDocOrRootProp: any | DocProp, rootName = DEFAULT_ROOT_NAME) {
    this._rawDoc = rawDocOrRootProp
    if (rawDocOrRootProp instanceof DocProp) {
      this._rootProp = rawDocOrRootProp
      this._rawDoc = rawDocOrRootProp.value
      this._rootName = rawDocOrRootProp.name
    } else {
      this._rawDoc = rawDocOrRootProp
      this._rootName = rootName
      this._rootProp = null
    }
  }

  get rawDoc() {
    return this._rawDoc
  }

  /**
   * 迭代文档中的数据
   */
  *[Symbol.iterator]() {
    if (this._rootProp) {
      yield this._rootProp
      if (Array.isArray(this._rootProp.value))
        yield* _parseArray(this._rootProp)
      else yield* _pasrseObj(this._rootProp)
    } else {
      let prop = new DocProp(undefined, this._rootName, this._rawDoc)
      yield prop
      if (Array.isArray(prop.value)) yield* _parseArray(prop)
      else yield* _pasrseObj(prop)
    }
  }
}

export class DocProp {
  _initialKey: string | number
  _value: any
  _parent?: DocProp
  _children: DocProp[]

  constructor(
    parent: DocProp | undefined,
    keyOrIndex: string | number,
    value: any,
    propIndex?: number
  ) {
    this._parent = parent
    this._value = value
    this._initialKey = keyOrIndex
    /**加入到父属性中*/
    this._children = []
    if (parent) {
      if (
        typeof keyOrIndex === 'number' &&
        keyOrIndex < parent._children.length
      ) {
        parent._children.splice(keyOrIndex, 0, this)
      } else {
        if (typeof propIndex === 'number')
          parent._children.splice(propIndex, 0, this)
        else parent._children.push(this)
      }
    }
  }

  set key(val: string | number) {
    this._initialKey = val
  }
  /**
   * 属性在父属性中的名称或索引
   *
   * 如果是索引（数字类型），那么要返回属性在父属性中的实际位置。如果不能在父属性中找到，抛错误。
   */
  get key() {
    let { _initialKey } = this
    if (typeof _initialKey === 'number') {
      let index = this._parent ? this._parent._children.indexOf(this) : -1
      if (index === -1) {
        debug(
          `获得文档属性的key异常：_initialKey=${this._initialKey},_parent?._children.length=${this._parent?._children.length},_value=${this._value}\n` +
            JSON.stringify(this._parent, null, 2)
        )
        throw Error(
          `error ${this._initialKey}/${this._parent?._children.length}/${this._value}`
        )
      }
      return index
    }

    return this._initialKey
  }
  /**
   * 文档属性的全路径名称
   * 名称需要动态计算，因为父属性的名称会变（父属性是模板属性），属性在父属性中索引有可能改变（父属性是数组）
   */
  get name(): string {
    let { _parent, key } = this
    if (_parent?.name) {
      return _parent.name + (typeof key === 'number' ? `[${key}]` : `.${key}`)
    } else {
      /**根节点*/
      if (typeof key === 'string') return key
      else if (typeof key === 'number') return `[${key}]`
      else {
        let msg = `属性名称【${key}】的类型错误`
        throw Error(msg)
      }
    }
  }

  get value() {
    return this._value
  }

  set value(val: any) {
    this._value = val
  }

  get parent() {
    return this._parent
  }
  /**
   * 返回最后的一个后代字段
   * @returns
   */
  getEndProp(): DocProp | undefined {
    if (this._children.length === 0) return undefined
    let latestChild = this._children[this._children.length - 1]
    let latestDesc = latestChild.getEndProp()
    if (latestDesc) return latestDesc

    return latestChild
  }

  removeChild(key: string | number) {
    if (typeof key === 'number') {
      let child = this._children[key]
      if (child._children.length) {
        throw Error(`要删除的属性【${child.name}】包含子属性，不允许删除`)
      }
      if (this._value) this._value.splice(key, 1)
      this._children.splice(key, 1)
    } else if (typeof key === 'string') {
      let child = this._children.find((c) => c.key === key)
      if (child) {
        if (child._children.length) {
          throw Error(`要删除的属性【${child.name}】包含子属性，不允许删除`)
        }
        if (this._value) delete this._value[key]
        this._children.splice(this._children.indexOf(child), 1)
      }
    }
  }

  toJSON() {
    let { name, value } = this
    let children = this._children.length
    return { name, value, children }
  }
  /**
   * 根据属性的名称，返回父属性的名称
   * @param name 属性名称
   */
  static parsePathAndKey(name: string) {
    // 去掉属性名称中最后的部分
    if (!name) throw Error('属性名称为空，无法计算父属性名称')
    let parts = name.split('.')
    let key = parts.splice(-1, 1)
    return { path: parts.join('.'), key: key[0] }
  }
}

function nameToRegExp(name: string): string {
  return name.replace('.', '\\.').replace('[', '\\[').replace(']', '\\]')
}

/**
 * 将文档转换为数组表示
 * 因为模板属性（patternProperties）和数组子项目属性的定义和文档对象的属性是1对多的关系，不便于进行处理。引入DocAsArray为文档对象建立索引，方便与属性定义对应。
 */
export class DocAsArray {
  _rawDoc
  _rootName
  _properties: DocProp[] // 文档的属性
  _snapshot = new Map<string, DocProp>()
  renderCounter: any // 用于出发渲染

  constructor(rawDoc: any = {}, rootName = DEFAULT_ROOT_NAME) {
    this._rawDoc = rawDoc
    this._rootName = rootName

    let iter = new DocIter(rawDoc, rootName)
    let props = Array.from(iter)
    this._properties = props ?? []

    this.renderCounter = { value: 0 }
  }

  get rawDoc() {
    return this._rawDoc
  }

  get properties() {
    return this._properties
  }

  snapshot(renew = false) {
    if (renew === true) {
      this._snapshot.clear()
      for (let p of this._properties) {
        this._snapshot.set(p.name, p)
      }
    }
    return this._snapshot
  }
  /**
   *
   */
  forceRender() {
    this.renderCounter.value++
  }
  /**
   *
   * @param name
   * @returns
   */
  findByName(name: string): {
    index: number
    prop: DocProp | undefined
  } {
    let index = -1,
      prop
    for (let i = 0; i < this._properties.length; i++) {
      if (this._properties[i].name === name) {
        index = i
        prop = this._properties[i]
        break
      }
    }
    return { index, prop }
  }
  /**
   * 返回最后的一个后代字段的位置
   * 没有子字段时返回-1
   * @returns
   */
  getEndIndex(prop: DocProp): number {
    let latest = prop.getEndProp()
    if (latest) {
      return this._properties.indexOf(latest)
    }
    return -1
  }
  /**
   * 根据记录的文档属性构造文档对象
   *
   * 如果指定了schema参数，属性必须与schema匹配，不匹配的将清除
   *
   * @param rawSchema 指定的原始属性定义
   * @returns
   */
  build(rawSchema?: RawSchema, cleanEmpty = false): any {
    console.time('json-doc:build:doc')
    let log = debug.extend('build')
    // 清理空数据
    if (cleanEmpty === true) {
      this.cleanEmpty(false)
    }

    let schemaProps: SchemaProp[] = []
    if (rawSchema) {
      const iter = new SchemaIter(rawSchema)
      for (let prop of iter) schemaProps.push(prop)
    }

    const handleDocProp = (prop: DocProp, index: number) => {
      if (index === 0) return
      let val = this.get(prop)
      val = JSON.parse(JSON.stringify(val))
      _set(Output, prop.name, val)
    }

    const Output = Array.isArray(this._rawDoc) ? [] : {}
    const JsonDocPropNames: string[] = [] // json字段的名称
    if (schemaProps.length) {
      log('根据指定的schema去除数据')
      /**根据schema生成文档，忽略文档中没有对应schema的内容*/
      schemaProps.forEach((schemaProp, index) => {
        // 模板属性会有多个匹配的文档属性
        let docProps = this._properties.filter((docProp) => {
          return schemaProp.fullRegExp.test(docProp.name)
        })
        docProps.forEach((docProp) => {
          // 根节点不需要处理
          if (!docProp.name) return
          if (docProp) {
            log(
              `文档属性【${docProp.name}】匹配的属性定义【${schemaProp.fullname}】`
            )
            let jsonParentName = JsonDocPropNames.find(
              (n) => docProp?.name.indexOf(n) === 0
            )
            if (jsonParentName) {
              log(
                `文档属性【${docProp.name}】是json类型的文档属性【${jsonParentName}】的值，赋值null`
              )
              _set(Output, docProp.name, null)
              return
            }
            if (schemaProp.attrs.type === 'json') {
              log(`文档属性【${docProp.name}】是json类型，需要处理下层节点`)
              JsonDocPropNames.push(docProp.name)
            } else {
              if (docProp._children.length) {
                log(`文档属性【${docProp.name}】不是叶节点，赋值null`)
                _set(Output, docProp.name, null)
                return
              }
            }
            handleDocProp(docProp, index)
          }
        })
      })
    } else {
      log('返回全部数据')
      this._properties.forEach(handleDocProp)
    }

    console.timeEnd('json-doc:build:doc')

    return Output
  }
  /**
   * 根据属性的值添加子属性
   * @param prop 属性
   */
  private _addSubProps(prop: DocProp): number {
    let num = 0
    let iter = new DocIter(prop)
    Array.from(iter)
      .slice(1)
      .forEach((child) => {
        this._properties.push(child)
        num++
      })
    return num
  }
  /**
   * 给属性追加子属性
   *
   * @param name 属性的名称
   * @param value 子属性的值
   * @param key 子属性的名称
   */
  appendAt(name: string, value: any, key?: string, needRender = true) {
    const log = debug.extend('appendAt')
    let newProp
    let { index: parentIndex, prop: parent } = this.findByName(name)
    if (parent === undefined) {
      log(`指定的属性【${key}】的父属性【${name}】不存在，需要添加父属性`)
      if (typeof key === 'string') this.set(name, {}, false)
      else this.set(name, [], false)
      let indexAndProp = this.findByName(name)
      parentIndex = indexAndProp.index
      parent = indexAndProp.prop
      if (parent === undefined)
        throw Error(
          `指定的属性【${key}】的父属性【${name}】不存在，添加默认值失败`
        )
    }

    log(
      `属性【${key ?? true}】的父文档属性【${name}】存储位置【${parentIndex}】`
    )

    if (typeof key === 'string') {
      /**对象添加子属性*/
      // 子属性名匹配规则
      // let re = name
      //   ? new RegExp(`^${nameToRegExp(name)}\\.(\\w+)(\\.|$)`)
      //   : new RegExp(`^\\w+(\\.|$)`)
      // let lastChildIndex = parentIndex + 1
      // while (lastChildIndex < this._properties.length) {
      //   let next = this._properties[lastChildIndex]
      //   if (!re.test(next.name)) {
      //     break
      //   }
      //   lastChildIndex++
      // }
      let endIndex = this.getEndIndex(parent)
      log(`属性【${name}】最后一个后代的存储位置【${endIndex}】`)
      if (endIndex === -1) endIndex = parentIndex
      newProp = new DocProp(parent, key, value)
      this._properties.splice(endIndex + 1, 0, newProp)
      log(
        `属性【${name}】在存储位置【${endIndex}】添加子属性【${newProp.name}】`
      )
    } else if ((key ?? true) || typeof key === 'number') {
      /**数组添加项目*/
      let index = parent._children.length
      newProp = new DocProp(parent, index, value)
      this._properties.push(newProp)
      log(`属性【${name}】添加子属性【${newProp.name}】`)
    }
    // 需要添加子字段。插入的位置需要控制吗？
    if (newProp && typeof value === 'object' && Object.keys(value).length) {
      let num = this._addSubProps(newProp)
      log(`属性【${newProp.name}】的值是对象，生成并添加【${num}】个子属性`)
    }

    if (needRender) this.renderCounter.value++
  }

  /**
   * 给属性添加兄弟属性
   * @param name 属性名称
   * @param value 添加的值
   * @param key
   */
  insertAt(name: string, value: any, key?: string, needRender = true) {
    const log = debug.extend('insertAt')
    let { prop } = this.findByName(name)
    if (prop === undefined) throw Error(`指定的兄弟属性【${name}】不存在`)

    let parent = prop._parent
    if (!parent) throw Error(`指定的兄弟属性【${name}】不存在父属性`)

    let siblings = parent._children
    let index = siblings.indexOf(prop)
    let newProp
    if (Array.isArray(parent.value)) {
      newProp = new DocProp(parent, index, value)
    } else if (typeof parent.value === 'object' && typeof key === 'string') {
      newProp = new DocProp(parent, key, value, index)
    } else {
      throw Error(
        `指定的兄弟属性【${name}】的父属性的值不是对象或数组，无法插入新属性`
      )
    }

    this._properties.push(newProp)

    // 需要添加子字段。插入的位置需要控制吗？
    if (newProp && typeof value === 'object' && Object.keys(value).length) {
      let num = this._addSubProps(newProp)
      log(`属性【${newProp.name}】的值是对象，生成并添加【${num}】个子属性`)
    }

    if (needRender) this.renderCounter.value++
  }
  /**
   * 删除指定属性
   * @param name 指定的属性
   * @returns
   */
  remove(name: string, needRender = true) {
    let { index, prop } = this.findByName(name)
    if (prop === undefined) {
      debug(`字段【${name}】不存在，无法执行删除操作`)
      // 触发重新渲染
      if (needRender) this.renderCounter.value++
      return undefined
    }

    let { _parent, key } = prop

    /**需要先删除子属性，再删除属性*/
    let i = prop._children.length - 1
    while (i >= 0) {
      let child = prop._children[i]
      this.remove(child.name, false)
      i--
    }

    // 删除属性
    if (_parent && key !== undefined) _parent.removeChild(key)
    this._properties.splice(index, 1)

    // 触发重新渲染
    if (needRender) this.renderCounter.value++

    return true
  }
  /**
   * 向前移动当前字段在父字段中的位置
   * @param name
   * @param needRender
   */
  moveUp(name: string, needRender = true) {
    let { index, prop } = this.findByName(name)
    if (prop === undefined) {
      debug(`属性【${name}】不存在，无法执行向前移动操作`)
      // 触发重新渲染
      // if (needRender) this.renderCounter.value++
      return false
    }
    let { parent } = prop
    if (!parent) {
      debug(`属性【${name}】不存在父属性，无法执行向前移动操作`)
      return false
    }
    let childIndex = parent._children.indexOf(prop)
    if (childIndex === 0) {
      debug(`属性【${name}】在位置0，无法执行向前移动操作`)
      return false
    }
    /*在全局数组中移动*/
    let prev = parent._children[childIndex - 1]
    let prevIndex = this.properties.indexOf(prev)
    let endIndex = this.getEndIndex(prop)
    if (endIndex === -1) endIndex = index
    debug(
      `属性【${name}】从全局位置【${index}到${endIndex}】，向前移动到位置【${prevIndex}】`
    )
    let moved = this._properties.splice(index, endIndex - index + 1)
    this._properties.splice(prevIndex, 0, ...moved)

    /*在父数组中移动*/
    parent._children.splice(childIndex, 1)
    parent._children.splice(childIndex - 1, 0, prop)
    debug(`属性【${name}】从父属性中位置【${childIndex}】，向前移动`)

    // 触发重新渲染
    if (needRender) this.renderCounter.value++

    return true
  }
  /**
   * 移动当前字段在父字段中的位置
   * @param name
   * @param needRender
   */
  moveDown(name: string, needRender = true) {
    let { index, prop } = this.findByName(name)
    if (prop === undefined) {
      debug(`属性【${name}】不存在，无法执行向后移动操作`)
      // 触发重新渲染
      // if (needRender) this.renderCounter.value++
      return false
    }
    let { parent } = prop
    if (!parent) {
      debug(`属性【${name}】不存在父属性，无法执行向后移动操作`)
      return false
    }
    let childIndex = parent._children.indexOf(prop)
    if (childIndex === parent._children.length - 1) {
      debug(`属性【${name}】在位置【${childIndex}】，无法执行向后移动操作`)
      return false
    }
    /*在全局数组中移动*/
    let next = parent._children[childIndex + 1]
    let nextIndex = this.properties.indexOf(next)
    let nextEndIndex = this.getEndIndex(next)
    if (nextEndIndex === -1) nextEndIndex = nextIndex
    debug(
      `属性【${name}】的后续属性从全局位置【${nextIndex}到${nextEndIndex}}】，向前移动到位置【${index}】`
    )
    let moved = this._properties.splice(nextIndex, nextEndIndex - nextIndex + 1)
    this._properties.splice(index, 0, ...moved)

    /*在父数组中移动*/
    parent._children.splice(childIndex + 1, 1)
    parent._children.splice(childIndex, 0, next)
    debug(
      `属性【${name}】的后续数据从父属性中位置【${childIndex + 1}】，向前移动`
    )

    // 触发重新渲染
    if (needRender) this.renderCounter.value++

    return true
  }
  /**
   * 返回指定字段的值。如果指定的属性有子属性，使用子属性的值构造属性的值。
   * @param nameOrProp
   * @returns
   */
  get(nameOrProp: string | DocProp): any {
    let prop
    if (nameOrProp instanceof DocProp) {
      prop = nameOrProp
    } else {
      prop = this.findByName(nameOrProp).prop
    }

    if (prop?._children.length) {
      if (Array.isArray(prop.value)) {
        return prop._children.map((child) => child.value)
      } else if (typeof prop.value === 'object') {
        return prop._children.reduce(
          (val, child) => Object.assign(val, { [child.key]: child.value }),
          {}
        )
      }
    }

    return prop?.value
  }
  /**
   * 返回指定字段的值。如果指定的属性有子属性，使用子属性的值构造属性的值。
   * @param name
   * @returns
   */
  get2(name: string): any {
    // let { prop } = this.findByName(name)
    let prop = this.snapshot().get(name)
    if (prop?._children.length) {
      if (Array.isArray(prop.value)) {
        return prop._children.map((child) => child.value)
      } else if (typeof prop.value === 'object') {
        return prop._children.reduce(
          (val, child) => Object.assign(val, { [child.key]: child.value }),
          {}
        )
      }
    }

    return prop?.value
  }
  /**
   * 指定的字段是否存在
   * @param name
   */
  has(name: string): boolean {
    let { index } = this.findByName(name)
    return index >= 0
  }
  /**
   *
   * @param name
   * @param value
   * @returns
   */
  set(name: string, value: any, needRender = true) {
    const log = debug.extend('set')
    let { prop } = this.findByName(name)
    if (prop === undefined) {
      let { path, key } = DocProp.parsePathAndKey(name)
      log(`属性【${name}】在文档中不存在，在它的父属性【${path}】中进行追加`)
      this.appendAt(path, value, key)
    } else {
      /**修改父对象 */
      let { _parent } = prop
      if (_parent) {
        _set(_parent.value, name, value)
        log(
          `修改属性【${prop.name}】在父属性中的值\n` +
            JSON.stringify(value, null, 2)
        )
      }
      /**
       * 如果属性有子节点需要把节点都清除等待重建
       */
      let i = prop._children.length - 1
      while (i >= 0) {
        let child = prop._children[i]
        this.remove(child.name, false)
        i--
      }
      // 需要添加子字段。插入的位置需要控制吗？
      prop.value = value
      if (typeof value === 'object' && Object.keys(value).length) {
        let num = this._addSubProps(prop)
        log(`属性【${prop.name}】的值是对象，生成并添加【${num}】个子属性`)
      }
    }

    if (needRender) this.renderCounter.value++
  }
  /**
   * 修改属性名称
   * @param oldFullname
   * @param newKey
   * @param needRender
   */
  rename(oldFullname: string, newKey: string, needRender = true) {
    let { prop } = this.findByName(oldFullname)
    if (!prop) throw Error(`指定的属性【${oldFullname}】不存在`)

    let parent = prop._parent
    if (parent) {
      delete parent.value[prop.key]
      parent.value[newKey] = prop.value
    }
    prop.key = newKey

    if (needRender) this.renderCounter.value++
  }
  /**
   * 清除文档中的空数据，值为空字符串，null，undefine，或空数组，或空对象
   */
  cleanEmpty(needRender = true) {
    let counter = 0
    for (let i = this._properties.length - 1; i > -0; i--) {
      let prop = this._properties[i]
      if (prop._children.length === 0) {
        let { value } = prop
        if (
          value === null ||
          value === undefined ||
          value === '' ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'object' && Object.keys(value).length === 0)
        ) {
          debug(`清除空属性【${prop.name}】`)
          this.remove(prop.name, false)
        }
      }
    }
    if (needRender) this.renderCounter.value++
    return counter
  }
  /**
   * 输出所有属性的key，便于调试
   */
  names() {
    return this.properties.map((p) => p.name)
  }
}
