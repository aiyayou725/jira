import React from "react";
import { Button, Dropdown, Menu, Table} from "antd";
import { Pin } from "assets/components/pin";
import { Link } from "react-router-dom";
import { User } from "./search-panel";
import { useEditProject } from 'utils/project'
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { projectListActions } from "./project-list-slice";

export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number
}
interface ListProps {
  users: User[];
  refresh?: () => void;
}
export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject()
  const dispatch = useDispatch()
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin }).then(props.refresh)
  return (
    <Table
      pagination={false}
      rowKey="id"
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(value, project) {
            return <Pin checked={project.pin} onCheckedChange={pinProject(project.id)} />
          }
        },
        {
          title: "名称",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(value, project) {
            return <Link to={String(project.id)}>{project.name}</Link>
          }
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render: (value, project) => (
            <span>
              {users.find((user: User) => user.id === project.personId)?.name}
            </span>
          ),
        },
        {
          title: "创建时间",
          render(value, project) {
            return <span>
              {project.created ? dayjs(project.created).format('YYYY-MM-DD') : '无'}
              
            </span>
          }
        },
        {
          render(value, project) {
            return <Dropdown overlay={<Menu>
              <Menu.Item key={"edit"}>
              <Button style={{padding: 0}} type={"link"} onClick={() => dispatch(projectListActions.openProjectModal())}>创建项目</Button>
              </Menu.Item>
            </Menu>}>
            <Button style={{padding: 0}} type={"link"}>...</Button>
            </Dropdown>
          }
        }
      ]}
      {...props}
    />
  )
};
