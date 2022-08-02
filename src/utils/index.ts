import { useState, useEffect, useRef } from "react";

export const isFalsy = (value: unknown) => (value === 0 ? false : !value);
export const isVolid = (value: unknown) => value === undefined || value === null || value === ''

 
// 在一个函数里，改变传入的对象本身是不好的
export const cleanObject = (obj: {[key: string]: unknown}) => {
  const result = { ...obj };
  Object.keys(obj).forEach((key) => {
    // @ts-ignore
    const value = obj[key];
    if (isVolid(value)) {
      // @ts-ignore
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line
  }, []);
};
// 使用泛型的例子
export const useDebounce = <V>(value: V, delay?: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // 每次在value变化以后，设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次在上一个useEffect处理完以后再执行
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};
export const useArray = <T>(initialArray: T[]) => {
  const [value, setValue] = useState(initialArray);
  return {
    value,
    setValue,
    add: (item: T) => {
      setValue([...value, item]);
    },
    clear: () => {
      setValue([]);
    },
    removeIndex: (index: number) => {
      const copy = [...value];
      copy.splice(index, 1);
      setValue(copy);
    },
  };
};

export const useDocumnetTitle = (title: string, KeepOnUnmount: boolean = true) => {
  const oldTitle = useRef(document.title).current;
  useEffect(() => {
    document.title = title 
  }, [title])

  useEffect(() => {
    return () => {
      if (!KeepOnUnmount) {
        document.title = oldTitle
      }
    }  
  }, [KeepOnUnmount, oldTitle])
}

export const resetRoute = () => window.location.href = window.location.origin

/**
 * 返回组件的挂载状态，如果还没挂载或已卸载，返回false，反之返回true
 */
export const useMountedRef = () => {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });
  return mountedRef;
};
