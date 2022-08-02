import { User } from "screens/project-list/search-panel";
import { useAsync } from "./use-async";
import { useEffect } from "react";
import { cleanObject } from "utils";
import { useHttp } from "./http";

export const useUsers = (param?: Partial<User>) => {
  const client = useHttp()
  const {run, ...result} = useAsync<User[]>()
  useEffect(() => {
    run(client("users", { data: cleanObject(param || {})}))
    // eslint-disable-next-line
  }, [param]);
  return result 
  
}