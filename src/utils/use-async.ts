import { useState } from "react";
import { useMountedRef } from "utils";

interface State<D>{
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success'
}

const defaultInitialState: State<null> = {
  stat: 'idle',
  data: null,
  error: null
}

const defaultConfig = {
  throwOnError: false
}
export const useAsync = <D>(initialState?: State<D>, initialConfig?: typeof defaultConfig) => {
  const config = { ...defaultConfig, ...initialConfig}
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState
  })

  const mountedRef = useMountedRef()

  const [retry, setRetry] = useState(() => () => { })
  

  const setData = (data: D) => setState({
    data,
    stat: 'success',
    error: null
  })

  const setError = (error: Error) => setState({
    error,
    stat: 'error',
    data: null
  })
   // run用来触发异步请求
  const run = (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
    if (!promise || !promise.then) {
      throw new Error('请传入 Promise 类型数据')
    }
    setRetry(() => () => {
      if (runConfig?.retry) {
        run(runConfig?.retry(), runConfig)
      }
    })
    setState({ ...state, stat: "loading" })
    return promise.then(data => {
      if (mountedRef.current) {
        setData(data)
      }
      return data
    }).catch(error => {
      // catch 会消化异常，如果不主动抛出，外面是不会接收到异常的
      setError(error)
      if (config.throwOnError) return Promise.reject(error)
      return error 
    })
  }

 

  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    // retry 被调用时重新跑一遍 run 让 state 刷新一遍
    retry,
    ...state,
  }
}