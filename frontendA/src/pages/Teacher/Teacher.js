import React, { Component } from "react";
import { Link } from "@reach/router";
// import { withRouter } from 'react-router-dom';
import { navigate } from "@reach/router";
import {
  Modal,
  Table,
  Space,
  Typography,
  Button,
  message,
  // Radio,
  // Tag,
  // Card,
  // Input,
  // TimePicker,
  // Menu,
  // Dropdown,
} from "antd";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  // UserOutlined,
  // VideoCameraOutlined,
  // NumberOutlined,
  // PushpinOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "antd/dist/antd.css";
import { backendUrl } from "../../utils/utils";

const { Title } = Typography;

export class Teacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teacherData: {},
    };
  }

  intervalID;

  componentDidMount() {
    this.getTeacherData();
    this.intervalID = setInterval(this.getTeacherData.bind(this), 400);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  getTeacherData = async () => {
    let res = await axios.get(backendUrl + "/user/admin/api/teacher");
    let data = res.data;
    console.log(data);
    this.setState({ teacherData: data });
  };

  deleteWarning(record) {
    Modal.confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Do you really want to delete these records? This process cannot be undone.",
      okText: "Confirm",
      okType: "danger primary",
      cancelText: "Cancel",
      onOk() {
        axios
          .delete(
            backendUrl + `/user/admin/api/teacher/delete/${record._id}`
          )
          .then(message.success("Teacher Deleted Successfully"))
          .then(navigate("/teacher"));
      },
    });
  }

  render() {
    const { teacherData } = this.state;
    const columns = [
      {
        title: "Teacher Name",
        dataIndex: "teacherName",
        key: "teacherName",
      },
      {
        title: "Short Name",
        dataIndex: "shortName",
        key: "shortName",
      },
      {
        title: "Designation",
        dataIndex: "designation",
        key: "designation",
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Space size="middle">
            <Link to={`/editTeacher/${record._id}`}>
              <EditOutlined style={{ fontSize: "22px", color: "blue" }} />
            </Link>
            <Button
              onClick={() => {
                this.deleteWarning(record);
              }}
            >
              <DeleteOutlined style={{ fontSize: "22px", color: "red" }} />
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <Link to="/user/admin/addTeacher">
          <Button type="primary">Add Teacher</Button>
        </Link>
        <Title className="input" level={3}>
          All Teachers
        </Title>
        <Table columns={columns} dataSource={teacherData.data} />
      </div>
    );
  }
}

export default Teacher;
