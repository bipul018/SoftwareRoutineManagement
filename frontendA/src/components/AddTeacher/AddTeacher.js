import React, { Component } from "react";
import axios from "axios";
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
import "antd/dist/antd.css";
import "./AddTeacher.css";
import { apiTeacherUrl } from "../../utils/utils";

const { Title } = Typography;

export class AddTeacher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teacherName: "",
      shortName: "",
      designation: "",
    };
  }
  ValidateFields = () => {
    if (this.state.teacherName === "") {
      message.error("Enter Teacher Name");
      return false;
    }
    if (this.state.shortName === "") {
      message.error("Enter Teacher Short Name");
      return false;
    }
    if (this.state.designation === "") {
      message.error("Enter Teacher Designation");
      return false;
    }
    return true;
  };

  render() {
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
          onClick={async () => {
            console.log(teacherName, shortName, designation);

            if (this.ValidateFields() === true) {
              axios.post(apiTeacherUrl +`/add`, {
                teacherName: teacherName,
                shortName: shortName,
                designation: designation,
              });
              this.setState({
                teacherName: "",
                shortName: "",
                designation: "",
              });
              message.success("Teacher Added Sucessfully");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              message.error("Teacher Cannot be Added");
            }
          }}
        >
          Submit
        </Button>
      </Card>
    );
  }
}

export default AddTeacher;
