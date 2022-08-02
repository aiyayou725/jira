import React from "react";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import { useDebounce, useDocumnetTitle } from "utils";
import styled from "@emotion/styled";
import { Button, Typography, Row } from "antd";
import {useProjects} from 'utils/project'
import { useUsers } from "utils/user";
import { useProjectsSearchParams } from "./util";
import { useDispatch } from "react-redux"
import { projectListActions } from "screens/project-list/project-list-slice";



export const ProjectListScreen = () => {
  useDocumnetTitle("项目列表", false)
  const [param, setParam] = useProjectsSearchParams()
  const { isLoading, error, data: list, retry } = useProjects(useDebounce(param, 200))
  const { data: users } = useUsers()
  const dispatch = useDispatch()

  return (
    <Container>
      <Row justify={"space-between"}>
        <h2>项目列表</h2>
        <Button
          style={{ padding: 0 }}
          onClick={() => dispatch(projectListActions.openProjectModal())}
          type={"link"}>创建项目</Button>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {
        error ? <Typography.Text type={'danger'}>{error.message}</Typography.Text> : null
      }
      <List
         // @ts-ignore：无法被执行的代码的错误
        refresh={retry} loading={isLoading}
        dataSource={list || []}
        users={users || []} />
    </Container>
  );
};

const Container = styled.div`
  padding: 3.2rem;
`
