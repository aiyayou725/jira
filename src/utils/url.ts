import { useMemo } from "react"
import { URLSearchParamsInit, useSearchParams } from "react-router-dom"
import { cleanObject } from "utils"

// 返回页面 url 中，指定键的参数
// 基本类型和组件状态可以放进依赖里，非组件状态的对象绝不可以放在依赖里，因为会造成无限渲染
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [serchParams, setSearchParam] = useSearchParams()
  return [
    useMemo(
      () => keys.reduce((prev, key) => {
        return {...prev, [key]: serchParams.get(key) || ''}
      }, {} as { [key in K]: string }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [serchParams]),
    (params: Partial<{ [key in K]: unknown }>) => {
      const o = cleanObject({ ...Object.fromEntries(serchParams), ...params }) as URLSearchParamsInit
      return setSearchParam(o)
    }
  ] as const
}