import { URLSearchParamsInit, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { cleanObject, subset } from "utils/index";

/**
 * 返回页面url中，指定键的参数值
*/

// useSearchParams()会返回当前查询参数对象，使用其get（键名）方法可以获取键值
export const useUrlQueryParam = <K extends string>(keys: K[]) => {
  const [searchParams] = useSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  const [stateKeys] = useState(keys);
  return [
    // 读取URL的参数值
    useMemo(
      () =>
        subset(Object.fromEntries(searchParams), stateKeys) as {
          [key in K]: string;
        },
      [searchParams, stateKeys]
    ),
    // 改变URL的参数值
    (params: Partial<{ [key in K]: unknown }>) => {
      return setSearchParams(params);
    },
  ] as const;
};
// useSearchParams的作用是读取和修改当前位置的URL的查询字符串
// 返回一个数组，第一个值是当前的search参数，第二个是更新search的函数
export const useSetUrlSearchParam = () => {
  const [searchParams, setSearchParam] = useSearchParams();
  return (params: { [key in string]: unknown }) => {
    // Object.fromEntries读取当前URL参数变成一个普通的对象
    const o = cleanObject({
      ...Object.fromEntries(searchParams),
      ...params,
    }) as URLSearchParamsInit;
    return setSearchParam(o);
  };
};
