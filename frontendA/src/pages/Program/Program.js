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

export class Program extends Component {
  constructor(props) {
    super(props);

    this.state = {
      programData: {},
    };
  }

  intervalID;
  componentDidMount() {
    this.getProgramData();
    this.intervalID = setInterval(this.getProgramData.bind(this), 400);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  getProgramData = async () => {
    let res = await axios.get(backendUrl + "/user/admin/api/program");
    let data = res.data;
    console.log(data);
    this.setState({ programData: data });
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
            backendUrl + `/user/admin/api/program/delete/${record._id}`
          )
          .then(message.success("Programme Deleted Sucessfully"))
          .then(navigate("/program"));
      },
    });
  }

  render() {
    const { programData } = this.state;
    const columns = [
      {
        title: "Program Name",
        dataIndex: "programName",
        key: "programName",
      },
      {
        title: "Year",
        dataIndex: "year",
        key: "year",
      },
      {
        title: "Part",
        dataIndex: "part",
        key: "part",
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Space size="middle">
            <Link to={`/editProgram/${record._id}`}>
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
        <Link to="/user/admin/addProgram">
          <Button type="primary">Add Program</Button>
        </Link>
        <Title className="input" level={3}>
          All Programme{" "}
        </Title>
        <Table columns={columns} dataSource={programData.data} />
      </div>
    );
  }
}

export default Program;
