import React from "react";
import styled from "@emotion/styled";
import { Button, Divider, List, Popover, Typography } from "antd";
import { useDispatch } from "react-redux";
import { projectListActions } from "screens/project-list/project-list-slice";
import { useProjects } from "../../utils/project";

export const ProjectPopover = () => {
  const dispatch = useDispatch()
  const { data: projects } = useProjects();
  const pinnedProjects = projects?.filter((project) => project.pin);
  const content = (
    <ContentContainer>
      <Typography.Text type={"secondary"}>收藏项目</Typography.Text>
      <List>
        {pinnedProjects?.map((project) => (
          <List.Item key={project.id}>
            <List.Item.Meta title={project.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
      <Button
        style={{ padding: 0 }}
        onClick={() => dispatch(projectListActions.openProjectModal())}
        type={"link"}>创建项目</Button>
    </ContentContainer>
  );
  return (
    <Popover placement={"bottom"} content={content}>
      <span>项目</span>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 20rem;
`;
