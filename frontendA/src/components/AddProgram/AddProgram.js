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
  // PushpinOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.css";
import "./AddProgram.css";
import { backendUrl } from "../../utils/utils";

const { Title } = Typography;

export class AddProgram extends Component {
  constructor(props) {
    super(props);

    this.state = {
      programName: "",
      year: "",
      part: "",
    };
  }
  ValidateFields = () => {
    if (this.state.programName === "") {
      message.error("Enter Programme Name");
      return false;
    }
    if (this.state.year === "") {
      message.error("Enter Year");
      return false;
    }
    // if (this.state.part === "") {
    //     message.error("Enter Routine Part");
    //     return false;
    // }
    return true;
  };

  render() {
    const { programName, year, part } = this.state;
    return (
      <Card
        className="card"
        style={{ backgroundColor: "#F3F1FF", margin: "12px" }}
      >
        <Title className="input" level={3}>
          Add/Edit Programme
        </Title>

        <Input
          className="input"
          size="large"
          placeholder="Programme Name"
          prefix={<UserOutlined />}
          value={programName}
          onChange={e => this.setState({ programName: e.target.value })}
        />
        <Input
          className="input"
          size="large"
          type="number"
          placeholder="year"
          prefix={<NumberOutlined />}
          value={year}
          onChange={e => this.setState({ year: e.target.value })}
        />
        <Input
          className="input"
          size="large"
          placeholder="part"
          prefix={<NumberOutlined />}
          value={part}
          onChange={e => this.setState({ part: e.target.value })}
        />

        <Button
          type="primary"
          className="input"
          style={{ backgroundColor: "#141414" }}
          onClick={() => {
            console.log(programName, year, part);

            if (this.ValidateFields() === true) {
              axios.post(backendUrl + `/user/admin/api/program/add`, {
                programName: programName,
                year: year,
                part: part,
              });
              this.setState({
                programName: "",
                year: "",
                part: "",
              });
              message.success("Programme Added Sucessfully");
              navigate("/program");
            } else {
              message.error("Programme Cannot be Added");
            }
          }}
        >
          Submit
        </Button>
      </Card>
    );
  }
}

export default AddProgram;
