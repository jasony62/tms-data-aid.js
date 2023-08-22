import Debug from 'debug'

const debug = Debug('json-schema:model')

export type EnumGroup = {
  id: any
  label: string
  assocEnum: {
    property: string
    value: any
  }
}

export type EnumOption = {
  label: string
  value: any
  group?: any
}

/**
 * 属性值自动填充位置
 */
export enum PropAutofillTarget {
  'value' = 'value',
  'items' = 'items',
}
/**
 * 自动填充数据获取策略
 */
export enum PropAutofillRunPolicy {
  'onCreate' = 'onCreate',
  'onParamChange' = 'onParamChange',
  'onUser' = 'onUser',
}
/**属性值自动填充*/
export type PropAutofill = {
  url: string
  method: string
  params?: { path?: string; value?: any; name: string }[]
  body?: { path?: string; value?: any; bodyPath: string }[]
  target: PropAutofillTarget
  runPolicy: PropAutofillRunPolicy
  valuePath?: string // 从返回结果中提取属性值的路径
  itemPath?: { path: string; label: string; value: string } // 从返回结果中提取属选项列表值的路径
}

/**
 * 属性是否在文档中存在的规则
 *
 * 指定的属性等于给定的值（const）
 * 指定的属性值不是nullish
 */
export type ExistIfRule = { [k: string]: { const?: string; valid?: boolean } }
/**
 * 属性是否在文档中存在的规则集
 */
export type ExistIfRuleSet = {
  properties?: ExistIfRule
  allOf?: ExistIfRuleSet[]
  oneOf?: ExistIfRuleSet[]
}
/**
 * 属性定义携带的基础信息
 */
export type SchemaPropAttrs = {
  type: string
  title?: string
  description?: string
  format?: string
  required?: boolean
  enum?: EnumOption[]
  anyOf?: EnumOption[]
  oneOf?: EnumOption[]
  enumGroups?: EnumGroup[]
  minItems?: number
  maxItems?: number
  default?: any
  autofill?: PropAutofill
  lookup?: any
  value?: any // 要要保留？没有对应的逻辑
  [k: string]: any
  initialName?: string
}
/**
 * 单个属性定义
 */
export class SchemaProp {
  _parent: SchemaProp | undefined
  _path: string
  _name: string
  attrs: SchemaPropAttrs
  existIf: ExistIfRuleSet | undefined
  lookup?: any
  items?: { type: string; [k: string]: any }
  attachment?: any
  isPattern = false //  是否是由正则表达式定义名称的子属性
  patternChildren: SchemaProp[] | undefined
  isOneOf = false // 在父属性中是否为排他属性
  isOneOfInclusiveGroup = '' // 所属亲和组名称
  isOneOfExclusiveGroup = '' // 所属互斥组名称
  isOneOfChildren = new Map<string, Map<string, SchemaProp[]>>() // 子属性中的排他属性，第1层是互斥组，第2层是亲和组

  constructor(path: string, name: string, type?: string) {
    this._path = path
    this._name = name
    this.attrs = { type: type ?? '' }
  }

  get parent() {
    return this._parent
  }

  set parent(val) {
    this._parent = val
  }

  get path() {
    // 因为允许父属性改名，所以需要动态计算
    if (this._parent) {
      let path = this._parent.fullname
      if (this._parent.attrs.type === 'array') path += '[*]'
      return path
    }

    return this._path
  }

  set path(val) {
    this._path = val
  }

  get name() {
    return this._name
  }

  set name(val) {
    this._name = val
  }

  /**
   * 属性定义的完整名称
   * 数组中项目为简单类型是，属性没有名字
   * 如果根属性是数组，那么根节点的路径名称是[*]
   */
  get fullname(): string {
    if (!this.name) return this.path

    if (!this.path) return this.name
    /**属性的类型是数组*/
    let fullname = this.path + (this.name === '[*]' ? '' : '.') + this.name

    return fullname
  }

  /**属性定义完整名称的正则表达式，用于检查文档属性是否匹配*/
  get fullRegExp(): RegExp {
    let log = debug.extend('fullRegExp')
    let { fullname } = this
    let re = fullname
      .replace(/^\^/, '')
      .replace(/\$$/, '')
      .replace(/\.\^/g, '.')
      .replace(/\$\./g, '.')
      .replace(/\$\[/g, '[')
      .replaceAll('[*]', '\\[\\d+\\]')
      .replace(new RegExp('\\.', 'g'), '\\.')
    if (this.attrs.type === 'array' && this.items?.type !== 'object') {
      log(
        `属性定义【${fullname}】为数组类型，数组项目的类型不是对象，需要解决子项目属性匹配`
      )
      re += '(\\[\\d+\\])?'
    }
    re = '^' + re + '$'

    log(`属性定义【${fullname}】的正则表达式为【${re}】`)

    return new RegExp(re)
  }

  /**如果需要去掉路径中的[*]获得父属性名称*/
  get parentFullname(): string {
    return this.path.replace(/\[\*\]$/, '')
  }

  /**是否是数组中项目*/
  get isArrayItem(): boolean {
    return /\[\*\]$/.test(this.path)
  }
}
/**
 * 数组项目定义
 */
export type SchemaItem = {
  type: string
  properties?: { [k: string]: RawSchema }
  format?: string
  formatAttrs?: { [k: string]: any } // 这个要保留吗？
  $ref?: any
  enum?: any
}
/**
 * JSONSchema定义
 */
export type RawSchema = {
  name?: string
  type: string
  title?: string
  description?: string
  properties?: { [k: string]: RawSchema }
  required?: boolean | string[]
  format?: string
  attrs?: any
  items?: SchemaItem
  enumGroups?: unknown[]
  enum?: any
  anyOf?: any
  oneOf?: any
  default?: any
  autofill?: PropAutofill
  lookup?: any
  attachment?: any
  component?: any
  visible?: any
  $id?: string
  assocs?: string[] // 这个不应该放在Schema里
  minLength?: number
  maxLength?: number
  pattern?: string
  $defs?: { [k: string]: RawSchema }
  initialName?: string
}

/**
 * 如果属性在父属性的properties里，那么就给父属性设置默认值
 */
function _setDefaultValue(
  newProp: SchemaProp,
  defVal: any,
  parents: SchemaProp[],
  isPatternProperty: boolean
) {
  let name = newProp.name
  if (parents.length) {
    let parent = parents[0]
    let { type, default: pDefVal } = parent.attrs
    if (isPatternProperty === false && type === 'object') {
      if (pDefVal && typeof pDefVal === 'object') {
        // 父属性有默认值，在父属性的默认值上设置当前属性的默认值
        pDefVal[name] = defVal
      } else {
        parent.attrs.default = { [name]: defVal }
        let child = parent
        for (let i = 1; i < parents.length; i++) {
          let p = parents[i]
          if (
            p.attrs.type === 'object' &&
            !p.patternChildren?.includes(child)
          ) {
            if (p.attrs.default && typeof p.attrs.default === 'object') {
              // 如果父属性已经有默认值，更新默认值，停止查找
              p.attrs.default[child.name] = child.attrs.default
              break
            } else {
              // 如果父属性没有默认值，设置默认值，继续查找
              p.attrs.default = { [child.name]: child.attrs.default }
              child = p
            }
          } else {
            // 父属性不是对象，或者属性是模板属性，结束
            break
          }
        }
      }
    }
  }
  newProp.attrs.default = defVal
}
/**依次处理子属性*/
function* _parseChildren(
  properties: { [k: string]: RawSchema },
  parents: SchemaProp[],
  requiredSet?: string[],
  isPatternProperty = false
): IterableIterator<SchemaProp> {
  let keys = Object.keys(properties)
  for (let i = 0, key; i < keys.length; i++) {
    key = keys[i]
    yield* _parseOne(
      key,
      properties[key],
      parents,
      requiredSet?.includes(key),
      isPatternProperty
    )
  }
}

/**处理JSONSchema的1个属性*/
function* _parseOne(
  name: string,
  rawProp: any,
  parents: SchemaProp[],
  mandatory?: boolean,
  isPatternProperty = false
): IterableIterator<SchemaProp> {
  const log = debug.extend('_parseOne')
  log(`开始解析属性【${name}】`)
  let path = ''

  if (parents.length) {
    path = parents[0].fullname
    if (parents[0].attrs.type === 'array') path += '[*]'
  }

  let newProp = new SchemaProp(path, name)

  // 设置父属性
  if (parents.length) newProp.parent = parents[0]

  if (mandatory) newProp.attrs.required = mandatory
  newProp.isPattern = isPatternProperty
  if (parents.length && isPatternProperty)
    parents[0].patternChildren?.push(newProp)

  let { properties, patternProperties, items, required, lookup, existIf } =
    rawProp

  let keys = Object.keys(rawProp)
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    switch (key) {
      case 'properties':
      case 'patternProperties':
      case 'lookup':
      case 'existIf':
      case 'required':
        break
      case 'items':
        newProp.items = { type: items.type }
        Object.keys(items).forEach((key) => {
          if (key === 'properties') return
          if (key === 'patternProperties') return
          //@ts-ignore
          Object.assign(newProp.items, { [key]: items[key] })
        })
      case 'attachment':
        newProp.attachment = rawProp.attachment
        break
      case 'type':
      case 'title':
      case 'description':
      case 'format':
      case 'oneOf':
      case 'anyOf':
      case 'enum':
      case 'enumGroups':
      case 'autofill':
      case 'initialName':
        Object.assign(newProp.attrs, { [key]: rawProp[key] })
        break
      case 'default':
        _setDefaultValue(newProp, rawProp.default, parents, isPatternProperty)
        break
      case 'isOneOf':
        if (parents.length && rawProp.isOneOf === true) {
          newProp.isOneOf = true
          const { isOneOfChildren } = parents[0]
          const { isOneOfInclusiveGroup, isOneOfExclusiveGroup } = rawProp
          let exclusiveGroup // 第1层是互斥组
          if (isOneOfExclusiveGroup) {
            if (!isOneOfChildren.has(isOneOfExclusiveGroup))
              isOneOfChildren.set(isOneOfExclusiveGroup, new Map())
            exclusiveGroup = isOneOfChildren.get(isOneOfExclusiveGroup)
          } else {
            if (!isOneOfChildren.has('')) isOneOfChildren.set('', new Map())
            exclusiveGroup = isOneOfChildren.get('')
          }
          if (exclusiveGroup) {
            // 第2层是亲和组
            if (isOneOfInclusiveGroup) {
              if (exclusiveGroup.has(isOneOfInclusiveGroup))
                exclusiveGroup.get(isOneOfInclusiveGroup)?.push(newProp)
              else exclusiveGroup.set(isOneOfInclusiveGroup, [newProp])
            } else {
              exclusiveGroup.set(newProp.name, [newProp])
            }
          }
        }
        break
      case 'isOneOfInclusiveGroup':
      case 'isOneOfExclusiveGroup':
        newProp[key] = rawProp[key]
        break
      default:
        Object.assign(newProp.attrs, { [key]: rawProp[key] })
    }
  }
  // 如果required是boolean值，作用于当前属性，如果是数组作用于子属性
  if (typeof required === 'boolean') {
    newProp.attrs.required = required
  }
  // 是否包含由正则表达式定义名称的子属性
  if (
    (rawProp.type === 'object' &&
      patternProperties &&
      typeof patternProperties === 'object') ||
    (rawProp.type === 'array' &&
      items?.patternProperties &&
      typeof items.patternProperties === 'object')
  ) {
    newProp.patternChildren = []
  }
  // 属性查询桂娥
  if (lookup && typeof lookup === 'object') newProp.lookup = lookup
  // 属性依赖规则
  if (existIf && typeof existIf === 'object') newProp.existIf = existIf

  // 返回当前的属性
  yield newProp

  // 指定哪些子属性为必填
  let requiredSet = Array.isArray(required) ? required : []

  if (rawProp.type === 'object') {
    /*处理对象属性下的子属性*/
    if (typeof properties === 'object') {
      /**属性的子属性*/
      yield* _parseChildren(properties, [newProp, ...parents], requiredSet)
    }
    if (typeof patternProperties === 'object') {
      /**属性的模板子属性*/
      yield* _parseChildren(
        patternProperties,
        [newProp, ...parents],
        requiredSet,
        true
      )
    }
  } else if (rawProp.type === 'array') {
    if (items && typeof items === 'object') {
      // 处理数组属性下的子属性
      if (typeof items.properties === 'object') {
        yield* _parseChildren(
          items.properties,
          [newProp, ...parents],
          requiredSet
        )
      }
      if (typeof items.patternProperties === 'object') {
        log(`属性${newProp.fullname}包含模板属性`)
        yield* _parseChildren(
          items.patternProperties,
          [newProp, ...parents],
          requiredSet,
          true
        )
      }
    }
  }
}
/**
 * 根节点默认名称
 */
export const DEFAULT_ROOT_NAME = ''
/**
 * JSONSchema对象迭代器
 */
export class SchemaIter {
  private _rawSchema
  private _rootName

  constructor(rawSchema: any, rootName = DEFAULT_ROOT_NAME) {
    this._rawSchema = rawSchema
    this._rootName = rootName
  }

  get rootName() {
    return this._rootName
  }

  /**
   * 迭代访问JSONSchema的属性
   */
  *[Symbol.iterator](): IterableIterator<SchemaProp> {
    // 从根属性开始遍历
    yield* _parseOne(this._rootName, this._rawSchema, [])
  }
}
