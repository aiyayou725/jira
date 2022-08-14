import React, { ReactNode } from "react";
// auth-provider 中提供了登录和注册的方法，
// 登录成功服务端会返回一个token，把token保存在localStorage中，注册时也基本同理
import * as auth from "auth-provider";
// http 是一个函数，他可以传入相关的配置，根据配置信息发送GET或POST HTTP请求返回响应的结果
import { http } from "utils/http";
// 组件一开始加载时执行的函数
import { useMount } from "utils";
// 返回请求数据时对应的状态一个通用的请求和retry的方法
import { useAsync } from "utils/use-async";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import { User } from "types/user";
import { useQueryClient } from "react-query";

interface AuthForm {
  username: string;
  password: string;
}

// 去localStorage中找token，获取用户信息，获取之后把他给setUser,为了在刷新的时候保持登录页面，
// 因为判断用户有没有登录用的是user，而user初始化为null
const bootstrapUser = async () => {
  let user = null;
  // 从localStorage中读取token
  const token = auth.getToken();
  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};

const AuthContext = React.createContext<
  | {
      user: User | null;
      register: (form: AuthForm) => Promise<void>;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();
  const queryClient = useQueryClient();

  // point free
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  // 退出登录时把用react-query缓存的数据清除
  const logout = () =>
    auth.logout().then(() => {
      setUser(null);
      queryClient.clear();
    });

  useMount(() => {
    run(bootstrapUser());
  });

  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth必须在AuthProvider中使用");
  }
  return context;
};
