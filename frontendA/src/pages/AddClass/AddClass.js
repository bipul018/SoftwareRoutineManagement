import React, { Component } from "react";
import { Link } from "@reach/router";
// import { withRouter } from 'react-router-dom';
import { navigate } from "@reach/router";
import {
  Modal,
  Table,
  Typography,
  Button,
  message,
  Space,
  // Tag,
  // Radio,
  // Card,
  // Input,
  // TimePicker,
  // Menu,
  // Dropdown,
} from "antd";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  // EditOutlined,
  // UserOutlined,
  // VideoCameraOutlined,
  // NumberOutlined,
  // PushpinOutlined,
} from "@ant-design/icons";
import {} from "antd";
import axios from "axios";
// import AddClassForm from "../../components/AddClassForm/AddClassForm";
import "antd/dist/antd.css";
import { apiClassUrl, backendUrl } from "../../utils/utils";

const { Title } = Typography;

// function AddClass() {
//     return (
//         <>
//             <AddClassForm />
//         </>
//     );
// };

// export default AddClass;

export class Class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classData: {},
    };
  }

  intervalID;

  componentDidMount() {
    this.getClassData();
    this.intervalID = setInterval(this.getClassData.bind(this), 400);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  getClassData = async () => {
    let res = await axios.get(apiClassUrl);
    let data = res.data;
    console.log(data);
    this.setState({ classData: data });
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
            backendUrl`/user/admin/api/class/delete/${record._id}`
          )
          .then(message.success("Class Deleted Sucessfully"))
          .then(navigate("/class"));
      },
    });
  }

  render() {
    const { classData } = this.state;
    const columns = [
      {
        title: "Routine For",
        dataIndex: "routineFor",
        key: "routineFor",
        render: routineFor => (
          <>
            {routineFor
              ? routineFor.programName +
                "_" +
                routineFor.year +
                "year_" +
                routineFor.part +
                "part"
              : ""}
          </>
        ),
      },
      {
        title: "Subject Name",
        dataIndex: "subjectName",
        key: "subjectName",
      },
      {
        title: "Class Code",
        dataIndex: "classCode",
        key: "classCode",
      },
      {
        title: "Class Group",
        dataIndex: "classGroup",
        key: "classGroup",
      },
      {
        title: "Starting Period",
        dataIndex: "startingPeriod",
        key: "startingPeriod",
      },
      {
        title: "No Of Period",
        dataIndex: "noOfPeriod",
        key: "noOfPeriod",
      },
      {
        title: "Course Code",
        dataIndex: "courseCode",
        key: "courseCode",
      },
      {
        title: "Week Day",
        dataIndex: "weekDay",
        key: "weekDay",
      },
      {
        title: "Action",
        dataIndex: "action",
        render: (text, record) => (
          <Space size="middle">
            {/* <Link to={`/editClass/${record._id}`} ><EditOutlined style={{ fontSize: '22px', color: 'blue' }} /></Link> */}
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
        <Link to="/addClass">
          <Button type="primary">Add Class</Button>
        </Link>
        <Title className="input" level={3}>
          All Classes
        </Title>
        <Table columns={columns} dataSource={classData.data} />
      </div>
    );
  }
}

export default Class;
