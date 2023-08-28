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
import { apiSubjectUrl, backendUrl, SubjectsList } from "../../utils/utils";
import { Radio, Select } from "antd/lib";

const { Title } = Typography;

export class AddSubject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subjectName: "",
      subjectCode: "",
      designation: "",
      mode: "add",
      subjectList:[],
      subjectSelected: {}
    };
  }
  ValidateFields = () => {
    if (this.state.subjectName === "") {
      message.error("Enter Subject Name");
      return false;
    }
    if (this.state.subjectCode === "") {
      message.error("Enter Subject Subject Code");
      return false;
    }
    return true;
  };

  ValidateFieldsB = ()=>{
    if (this.state.subjectSelected.subjectName === "") {
      message.error("Enter Subject Name");
      return false;
    }
    if (this.state.subjectSelected.subjectCode === "") {
      message.error("Enter Subject Subject Code");
      return false;
    }
    return true;
  }

  async fetchSubjectList() {
    const {data:res} = await axios.get(apiSubjectUrl + `/`);
    this.setState({subjectList: res.data}, ()=>console.log(this.state.subjectList))
  }

  async modeChange(value){
    if (this.state.mode != value)
      this.setState({subjectName: "", subjectCode: "", subjectSelected: {}})
    this.setState({mode: value})
    if (value == "edit"|| value == "delete"){
      if (this.state.subjectList.length == 0){
        await this.fetchSubjectList();
      }
    }
  }

  editSelect(value){


    const subjectSelected = this.state.subjectList.find(t => t._id == value)
    this.setState({
      subjectSelected: subjectSelected,
      subjectName: subjectSelected.subjectName,
      subjectCode: subjectSelected.subjectCode, 
    })
    

  }

  render() {

    const {mode,subjectList, subjectName, subjectCode} = this.state;
    const {subjectSelected} = this.state;

    

    return (
      <div>
      

      <Card
        className="card"
        style={{ backgroundColor: "#F3F1FF", margin: "12px" }}
      >
        
        <Title className="input" level={3}>
          Add/Edit Subject
        </Title>
        <Radio.Group
          defaultValue={"add"}
          options={[{label: "Add",value : "add"},{label: "Edit",value : "edit"},{label: "Delete",value : "delete"}]} 
          onChange={async val => await this.modeChange(val.target.value)}
          optionType="button"
        />
        <br/>
        <br/>
        {
          (mode == "edit" || mode == "delete")?
          (<div>
          <Select 
            showSearch
            optionFilterProp="label"
            style={{width: 400}}
            placeholder={"Search for Subject"}
            options={subjectList.map(tObj => {return {label: tObj.subjectName, value: tObj._id}})}
            onChange={val => this.editSelect(val)}
          >
          </Select>
          {
            (Object.keys(subjectSelected).length > 0)?(<div>
              <Input
                className="input"
                size="large"
                placeholder="Subject Name"
                value={subjectSelected.subjectName}
                prefix={<UserOutlined />}
                onChange={e => this.setState({
                  subjectSelected: {
                    _id: subjectSelected._id,
                    subjectName: e.target.value, 
                    subjectCode: subjectSelected.subjectCode, 
                  } })}
              />
              <Input
                className="input"
                size="large"
                placeholder="Subject Code"
                prefix={<NumberOutlined />}
                value={subjectSelected.subjectCode}
                onChange={e => this.setState({
                  subjectSelected: {
                    _id: subjectSelected._id,
                    subjectName: subjectSelected.subjectName, 
                    subjectCode: e.target.value, 
                  }})}
              />
              


              {(mode == "edit")?(<Button
                type="primary"
                className="input"
                style={{ backgroundColor: "#141414" }}
                onClick={async () => {
                  console.log(subjectName, subjectCode);

                  if (this.ValidateFieldsB()) {
                    axios.post(apiSubjectUrl +`/edit/${this.state.subjectSelected._id.toString()}`, {
                      subjectName: this.state.subjectSelected.subjectName,
                      subjectCode: this.state.subjectSelected.subjectCode,
                    });
                    message.success("Subject updated Sucessfully");
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  } else {
                    message.error("Subject Cannot be updated");
                  }
                }}
              >
                Submit
              </Button>):
              (<Button
                type="primary"
                className="input"
                style={{ backgroundColor: "#aa1515" }}
                onClick={async () => {
                    axios.post(apiSubjectUrl +`/delete/${this.state.subjectSelected._id.toString()}`, {});
                    message.success("Subject deleted Sucessfully");
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                
                }}
              >
                Delete
              </Button>)}
            </div>)
            
            
            
            :(<div/>)
          }


          
          </div>): (<div>
            <Input
              className="input"
              size="large"
              placeholder="Subject Name"
              value={subjectName}
              prefix={<UserOutlined />}
              onChange={e => this.setState({ subjectName: e.target.value })}
            />
            <Input
              className="input"
              size="large"
              placeholder="Subject Code"
              prefix={<NumberOutlined />}
              value={subjectCode}
              onChange={e => this.setState({ subjectCode: e.target.value })}
            />
          

            <Button
              type="primary"
              className="input"
              style={{ backgroundColor: "#141414" }}
              onClick={async () => {
                console.log(subjectName, subjectCode);

                if (this.ValidateFields() === true) {
                  axios.post(apiSubjectUrl +`/add`, {
                    subjectName: subjectName,
                    subjectCode: subjectCode,
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
          </div>)
        }

        <br/>
        <br/>


        
      </Card>
      </div>
    );
  }
}

export default AddSubject;
