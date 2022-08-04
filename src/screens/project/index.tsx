import React from "react";
import { Link } from "react-router-dom";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { KanbanScreen } from "screens/kanban";
import { EpicScreen } from "screens/epic";
import styled from "@emotion/styled";
import { Menu } from "antd";

const useRouteType = () => {
  const units = useLocation().pathname.split("/");
  return units[units.length - 1];
};

export const ProjectScreen = () => {
  const routeType = useRouteType();
  return (
    <Container>
      <Aside>
        <Menu mode={"inline"} selectedKeys={[routeType]}>
          {/* 如果to后面的路径写成/kanban会默认跟路由localhost：3000/kanban */}
          <Menu.Item key={"kanban"}>
            <Link to={"kanban"}>看板</Link>
          </Menu.Item>
          <Menu.Item key={"epic"}>
            <Link to={"epic"}>任务组</Link>
          </Menu.Item>
        </Menu>
      </Aside>
      <Main>
        <Routes>
          {/*projects/:projectId/kanban*/}
          <Route path={"/kanban"} element={<KanbanScreen />} />
          {/*projects/:projectId/epic*/}
          <Route path={"/epic"} element={<EpicScreen />} />
          {/* 如果上面两个都匹配不到跳转到看板页面 */}
          <Navigate to={window.location.pathname + "/kanban"} replace={true} />
        </Routes>
      </Main>
    </Container>
  );
};

const Aside = styled.aside`
  background-color: rgb(244, 245, 247);
  display: flex;
`;

const Main = styled.div`
  box-shadow: -5px 0 5px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 16rem 1fr;
  width: 100%;
`;
