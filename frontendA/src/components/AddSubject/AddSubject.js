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
import "./AddSubject.css";
import { apiSubjectUrl, backendUrl } from "../../utils/utils";

const { Title } = Typography;

export class AddSubject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subjectName: "",
      subjectCode: "",
    };
  }
  ValidateFields = () => {
    if (this.state.subjectName === "") {
      message.error("Enter Subject Name");
      return false;
    }
    // if (this.state.subjectCode === "") {
    //   message.error("Enter Teacher Designation");
    //   return false;
    // }
    return true;
  };

  render() {
    const { subjectName, subjectCode } = this.state;
    return (
      <Card
        className="card"
        style={{ backgroundColor: "#F3F1FF", margin: "12px" }}
      >
        <Title className="input" level={3}>
          Add/Edit subject
        </Title>

        <Input
          className="input"
          size="large"
          placeholder="Subject Name"
          prefix={<UserOutlined />}
          value={subjectName}
          onChange={e => this.setState({ subjectName: e.target.value })}
        />
        <Input
          className="input"
          size="large"
          placeholder="Subject Code"
          prefix={<PushpinOutlined />}
          value={subjectCode}
          onChange={e => this.setState({ subjectCode: e.target.value })}
        />

        <Button
          type="primary"
          className="input"
          style={{ backgroundColor: "#141414" }}
          onClick={() => {

            if (this.ValidateFields() === true) {
              axios.post(apiSubjectUrl +`/add`, {
                subjectName: subjectName,
                subjectCode: subjectCode
              });
              this.setState({
                subjectName:"",
                subjectCode:"",
              });
              message.success("Subject Added Sucessfully");
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
              message.error("Subject Cannot be Added");
            }
          }}
        >
          Submit
        </Button>
      </Card>
    );
  }
}

export default AddSubject;
