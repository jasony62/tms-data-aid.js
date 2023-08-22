import { JSONPath } from 'jsonpath-plus'
import _set from 'lodash.set'

/**
 * 数据提取规则
 */
export type TransformRule = { [receiverPath: string]: any }
/**
 * 设置数据
 * @param result
 * @param recvPath
 * @param valFrom
 * @param input
 */
function fill(result: any, recvPath: string, valFrom: any, input: any): any {
  switch (true) {
    case typeof valFrom === 'string' && valFrom.indexOf('$') === 0:
      /**
       * source是jsonpath，源数据中取值
       */
      let val = JSONPath({ path: valFrom, json: input, wrap: false })
      _set(result, recvPath, val)
      break
    default:
      /**
       * source是值，直接赋值
       */
      _set(result, recvPath, valFrom)
  }

  return result
}
/**
 * 执行数据转换
 * @param rule 定义的转换规则
 * @param input 提供数据的对象
 * @param receiver 接收数据的对象，如果指定，将转换的数据填入后返回
 */
export function transform(
  rule: TransformRule,
  input?: any,
  receiver?: any
): any {
  if (!rule || typeof rule !== 'object' || Object.keys(rule).length === 0)
    throw Error('没有指定转换规则')

  let result = receiver ?? {} // 转换结果
  Object.entries(rule).forEach(([recvPath, valFrom]) => {
    if (recvPath.indexOf('$') === 0) {
      /**
       * 根据接收对象的值选择使用的转换规则
       */
      if (!receiver) return

      let recvVal = JSONPath({
        path: recvPath,
        json: [receiver],
        wrap: false,
      })
      if (!recvVal) return
      /**
       * 执行匹配的规则
       */
      transform(valFrom, input, result)
    } else {
      fill(result, recvPath, valFrom, input)
    }
  })

  return result
}
