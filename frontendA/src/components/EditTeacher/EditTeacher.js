import React, { Component } from "react";
// import './AddTeacher.css';
// import { navigate, Match } from "@reach/router";
import { navigate } from "@reach/router";
import {
  Card,
  Input,
  Typography,
  Button,
  message,
  // Radio,
  // TimePicker,
  // Menu,
  // Dropdown,
} from "antd";
import {
  UserOutlined,
  // VideoCameraOutlined,
  NumberOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "antd/dist/antd.css";
import { backendUrl } from "../../utils/utils";

const { Title } = Typography;

export class EditTeacher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teacherName: "",
      shortName: "",
      designation: "",
    };
  }
  componentDidMount() {
    this.getTeacherData();
  }

  getTeacherData = async () => {
    let res = await axios.get(
      backendUrl + `/user/admin/api/teacher/${this.props.id}`
    );
    let data = res.data.data;
    //cosole.log(data);
    this.setState({
      teacherName: data.teacherName,
      shortName: data.shortName,
      designation: data.designation,
    });
  };

  ValidateFields = () => {
    if (this.state.teacherName === "") {
      message.error("Enter Teacher Name");
      return false;
    }
    if (this.state.shortName === "") {
      message.error("Enter Short Name");
      return false;
    }
    if (this.state.designation === "") {
      message.error("Enter Designation");
      return false;
    }
    return true;
  };

  render() {
    console.log(this.props.id);
    const paramsid = this.props.id;
    const { teacherName, shortName, designation } = this.state;
    return (
      <Card
        className="card"
        style={{ backgroundColor: "#F3F1FF", margin: "12px" }}
      >
        <Title className="input" level={3}>
          Add/Edit Teacher
        </Title>
        <Input
          className="input"
          size="large"
          placeholder="Teacher Name"
          prefix={<UserOutlined />}
          value={teacherName}
          onChange={e => this.setState({ teacherName: e.target.value })}
        />
        <Input
          className="input"
          size="large"
          placeholder="Short Name"
          prefix={<NumberOutlined />}
          value={shortName}
          onChange={e => this.setState({ shortName: e.target.value })}
        />
        <Input
          className="input"
          size="large"
          placeholder="Designation"
          prefix={<PushpinOutlined />}
          value={designation}
          onChange={e => this.setState({ designation: e.target.value })}
        />

        <Button
          type="primary"
          className="input"
          style={{ backgroundColor: "#141414" }}
          onClick={() => {
            console.log(teacherName, shortName, designation);

            if (this.ValidateFields() === true) {
              axios.post(
                backendUrl + `/user/admin/api/teacher/edit/${paramsid}`,
                {
                  teacherName: teacherName,
                  shortName: shortName,
                  designation: designation,
                }
              );
              this.setState({
                teacherName: "",
                shortName: "",
                designation: "",
              });
              message.success("Teacher Added Successfully");
              navigate("/teacher");
            } else {
              message.error("Teacher Cannot Be Added");
            }
          }}
        >
          Submit
        </Button>
      </Card>
    );
  }
}

export default EditTeacher;
