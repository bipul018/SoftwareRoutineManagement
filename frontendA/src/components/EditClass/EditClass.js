import React, { Component } from "react";
// import { navigate } from "@reach/router";
import {
  Form,
  Select,
  Card,
  InputNumber,
  Input,
  Typography,
  Button,
  Modal,
  getFieldDecorator,
  // message,
  // TimePicker,
  // Menu,
  // Dropdown,
  Radio,
  message,
} from "antd";
import // UserOutlined,
// VideoCameraOutlined,
// NumberOutlined,
// PushpinOutlined,
"@ant-design/icons";
import axios from "axios";
import "antd/dist/antd.css";

import { apiClassUrl, apiTeacherUrl, apiProgramUrl, backendUrl, apiSubjectUrl} from "../../utils/utils";
import { subjects, courseCode } from "../../utils/utils";


const { Option } = Select;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const { Title } = Typography;



class EditClassPopupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teacherData: "",
      programData: "",
      subjectData: [],

      selectedSubjectID: this.props.classObj.subject._id,
      routineFor: "",
      teacherName: this.props.classObj.teacherName.map(t => t._id),
      classCode: "",
      classGroup: "",
      startingPeriod: "1",
      noOfPeriod: 1,
      courseCode: "",
      link1: "",
      weekDay: "",
    };
    this.getTeacherData();
    this.getSubjectData();
    console.log(this.props.classObj)
  }

  getTeacherData = async () => {
    let { data: res } = await axios.get(apiTeacherUrl);
    this.setState({ teacherData: res.data });
  };

  getSubjectData = async () => {
    console.log('Got subjects')
    let { data: res } = await axios.get(apiSubjectUrl + `/`);
    this.setState({ subjectData: res.data });
  }


  // dont think this is needed?
  getClassData = async () => {
    let { data: res } = await axios.get(
      apiClassUrl + `${this.props.id}`
    );
    let data = res.data;

    this.setState({
      // teacherData: data.teacherData,
      // programData: data.programData,
      // routineFor: data.routineFor,
      // subjectName: data.subjectName,
      // teacherName: data.teacherName,
      // classCode: data.classCode,
      // classGroup: data.classGroup,
      // startingPeriod: data.startingPeriod,
      // noOfPeriod: data.noOfPeriod,
      // courseCode: data.courseCode,
      // link1: data.link1,
      // weekDay: data.weekDay,
    });
  };

  onFinish = async (values) => {
    const islengthValid = await this.handlePeriodLength();
    const isTeacherAvailable = await this.handleTeacherAvailability();
    if (!isTeacherAvailable)
      return

    const { programName, year, part, section, day, index, classObj, teacherTable, reloadFunc } = this.props;
    const programParams = `/programName/${programName}/year/${year}/part/${part}/section/${section}`;

    const id = classObj._id;

    let programRes = await axios.get(apiProgramUrl + programParams)
    const programID = programRes.data.data;

    const classUpdateDetails = {
      routineFor: programID,
      subjectID: this.state.selectedSubjectID,
      teacherName: this.state.teacherName,
      classType: values.classType,
      classGroup: values.classGroup,
      startingPeriod: index,
      noOfPeriod: values.noOfPeriod,
      courseCode: values.courseCode,
      link1: values.link1,
      weekDay: day,
    };
    console.log(classUpdateDetails)
    await axios.post(apiClassUrl + `/edit/${id}`, 
      classUpdateDetails)
    .then(message.success("Class updated"));
    Modal.destroyAll();
    reloadFunc();
  };

  async handleTeacherAvailability() {
    let {day, index } = this.props;
    let {noOfPeriod, teacherName} = this.state;
    let nperiods = noOfPeriod
    let teachers = teacherName;


    for (let teacherID of teachers){
      const resTeacher = await axios.get(apiTeacherUrl + `/${teacherID}`);
      const teacherObj = resTeacher.data.data;

      const availabilityCheckParams = `/available/teacher/${teacherID}/day/${day}/period/${index}/nperiods/${nperiods}`
      const resAvailability = await axios.get(apiClassUrl + availabilityCheckParams);
      console.log(resAvailability);

      if (!resAvailability.data.data.available){
        const teacherName = teacherObj.teacherName;
        const occupiedAtPeriod = resAvailability.data.data.overlapAt;
        const occupiedAtClass = resAvailability.data.data.overlapClass
        const occupiedAtProgram = occupiedAtClass.routineFor;
        const occupiedAtSubjectStr = `${occupiedAtClass.subject.subjectName} [${occupiedAtClass.classType}]\r\n Period: ${occupiedAtClass.startingPeriod} - ${occupiedAtClass.startingPeriod + occupiedAtClass.noOfPeriod - 1}`;

        const overlapClassStr = `Year ${occupiedAtProgram.year} ${occupiedAtProgram.programName} ${occupiedAtProgram.section}`
        Modal.warning({
          title: `Teacher ${teacherName} occupied at ${overlapClassStr} on ${day} at period ${occupiedAtPeriod}\r\n\r\n${occupiedAtSubjectStr}`,
        });
        return false;
      }
    }
    return true;
  }


  async handlePeriodLength(){
    try {
      let {programName, year, part, section, day, index } = this.props;
      let {noOfPeriod} = this.state;
      const programParams = `/programName/${programName}/year/${year}/part/${part}/section/${section}`

      const {data:resProgram} = await axios.get(apiProgramUrl + programParams);
      const programID = resProgram.data;

      const validityCheckParams = `/valid/${programID}/day/${day}/period/${index}/nperiods/${noOfPeriod}`
      const {data:validRes} = await axios.get(apiClassUrl + validityCheckParams);

      const validity = validRes.data;
      if (validity.valid)
        return true;

      const overlapClass = validity.overlap;
      const programStr = `Year ${year}/${part} ${programName} ${section}`
      const invalidLengthWarning = `Period collides with class ${overlapClass.subject.subjectName} [${overlapClass.classType}] for ${programStr}`
      Modal.warning({title: invalidLengthWarning});
      return false

    } catch (error) {
      console.log(error);
      return false;
    }

  }

  render = () =>{
    console.log(this.props.id);
    const {
      programData,
      teacherData,
      subjectData,
      routineFor,
      subjectName,
      teacherName,
      classCode,
      classGroup,
      startingPeriod,
      noOfPeriod,
      // courseCode,
      link1,
      weekDay,
    } = this.state;
    return (
      <Form
        {...layout}
        ref={this.formRef}
        name="control-ref"
        onFinish={this.onFinish}
        onValuesChange={(value) => {
          try {
            if (value.noOfPeriod != undefined)
              this.setState({noOfPeriod: parseInt(value.noOfPeriod)}, async ()=>{
                await this.handlePeriodLength()
                await this.handleTeacherAvailability()
              });
            else if (value.teacherName != undefined)
              this.setState({teacherName: value.teacherName}, this.handleTeacherSelection);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <Form.Item
          name="subjectName"
          label="Subject"
          rules={[
            {
              required: true,
              message: "Please enter Subject Name",
            },
          ]}
          initialValue = {this.props.classObj.subject._id}
        >

          <Select
            onChange={(value) => this.setState({ selectedSubjectID: value })}
            optionFilterProp="label"
            showSearch
          >
            {subjectData.map((item, index) => {
              return (
                <Option key={item.subjectName} value={item._id} label={item.subjectName}>
                  {item.subjectName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="classType"
          label="Class Type"
          rules={[
            {
              required: false,
              message: "Please enter Class type",
            },
          ]}
          initialValue={this.props.classObj.classType}
        >
          <Radio.Group defaultValue={"L"}>
            <Radio.Button key="L" value="L">
              Lecture [L]
            </Radio.Button>
            <Radio.Button key="L" value="P">
              Practical [P]
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="teacherName"
          label="Teachers"
          rules={[
            {
              required: true,
              message: "Please select teachers name",
            },
          ]}
          initialValue={this.props.classObj.teacherName.map(t => t._id)}
          >
          <Select
            optionFilterProp="label"
            mode="multiple"
            dropdownAlign="bottom"
            
            
          >
            {Object.values(teacherData).map((item, index) => {
              return (
                <Option key={item} value={item._id} label={item.teacherName}>
                  {item.teacherName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        {/* <Form.Item
          name="classGroup"
          label="Class Group"
          rules={[
            {
              required: false,
              message: "Please enter Class Group",
            },
          ]}
          initialValue="Both"
        >
          <Radio.Group defaultValue={"Both"}>
            <Radio.Button key="C" value="C">
              C
            </Radio.Button>
            <Radio.Button key="D" value="D">
              D
            </Radio.Button>
            <Radio.Button key="Both" value="Both">
              Both
            </Radio.Button>
          </Radio.Group>
        </Form.Item> */}

        <Form.Item label="No Of Periods">
          <Form.Item
            name="noOfPeriod"
            rules={[
              {
                required: true,
                message: "Please enter No Of Periods",
              },
            ]}
            noStyle
            initialValue={`${this.props.classObj.noOfPeriod}`}
          >
            <Radio.Group defaultValue="1">
              <Radio.Button key="1" value="1">
                1
              </Radio.Button>
              <Radio.Button key="2" value="2">
                2
              </Radio.Button>
              <Radio.Button key="3" value="3">
                3
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            style={{ backgroundColor: "#141414" }}
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

// not used i think?
class EditClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teacherData: "",
      programData: "",
      routineFor: "",
      subjectName: "",
      teacherName: [""],
      classCode: "",
      classGroup: "",
      startingPeriod: "1",
      noOfPeriod: "",
      courseCode: "",
      link1: "",
      weekDay: "",
    };
  }
  componentDidMount() {
    this.getClassData();
  }

  getClassData = async () => {
    let res = await axios.get(
      backendUrl + `/user/admin/api/class/${this.props.id}`
    );
    let data = res.data.data;
    //cosole.log(data);
    this.setState({
      teacherData: data.teacherData,
      programData: data.programData,
      routineFor: data.routineFor,
      subjectName: data.subjectName,
      teacherName: data.teacherName,
      classCode: data.classCode,
      classGroup: data.classGroup,
      startingPeriod: data.startingPeriod,
      noOfPeriod: data.noOfPeriod,
      courseCode: data.courseCode,
      link1: data.link1,
      weekDay: data.weekDay,
    });
  };

  render() {
    console.log(this.props.id);
    // const paramsid = this.props.id;
    const {
      programData,
      teacherData,
      routineFor,
      subjectName,
      teacherName,
      classCode,
      classGroup,
      startingPeriod,
      noOfPeriod,
      courseCode,
      link1,
      weekDay,
    } = this.state;
    console.log(
      programData,
      teacherData,
      routineFor,
      subjectName,
      teacherName,
      classCode,
      classGroup,
      startingPeriod,
      noOfPeriod,
      courseCode,
      link1,
      weekDay
    );
    return (
      <Card
        className="card"
        style={{ backgroundColor: "#F3F1FF", margin: "12px" }}
      >
        <Title className="input" level={3}>
          Add/Edit Class
        </Title>
        <Form
          {...layout}
          ref={this.formRef}
          name="control-ref"
          onFinish={this.onFinish}
        >
          {/* <Form.Item
                        name="routineFor"
                        label="Routine For"
                        rules={[
                            {
                                required: true,
                                message: 'Please select a programme',

                            },
                        ]}
                    >
                        <Select
                            placeholder="Select a option and change input text above"
                            onChange={(value) => this.setState({ routineFor: value })}
                            allowClear
                        >
                            {Object.values(programData).map((item, index) => {
                                return (<Option value={item._id}>{item.programName}_{item.year}year_{item.part}part</Option>)
                            })}

                        </Select>
                    </Form.Item> */}

          <Form.Item
            name="subjectName"
            label="Subject Name"
            rules={[
              {
                required: true,
                message: "Please enter Subject Name",
              },
            ]}
          >
            <Input value={subjectName} />
          </Form.Item>

          {/* <Form.Item
                        name="teacherName"
                        label="Select Teachers"
                        rules={[
                            {
                                required: true,
                                message: 'Please select teachers name',
                                type: 'array',
                            },
                        ]}
                    >
                        <Select mode="multiple" placeholder="Select a option and change input text above" onChange={(value) => this.setState({ teacherName: value })}>
                            {Object.values(teacherData).map((item, index) => {
                                return (<Option value={item._id}>{item.teacherName}</Option>)
                            })}

                        </Select>
                    </Form.Item> */}

          <Form.Item
            name="classCode"
            label="Class Code"
            rules={[
              {
                required: false,
                message: "Please enter Class Code",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="classGroup"
            label="Class Group"
            rules={[
              {
                required: false,
                message: "Please enter Class Group",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Starting Period">
            <Form.Item
              name="startingPeriod"
              rules={[
                {
                  required: true,
                  message: "Please enter Starting Period",
                },
              ]}
              noStyle
            >
              <InputNumber value={startingPeriod} min={1} max={8} />
            </Form.Item>
          </Form.Item>

          <Form.Item label="No Of Periods">
            <Form.Item
              name="noOfPeriod"
              rules={[
                {
                  required: true,
                  message: "Please enter No Of Periods",
                },
              ]}
              noStyle
            >
              <InputNumber min={1} max={8} />
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="courseCode"
            label="Course Code"
            rules={[
              {
                required: false,
                message: "Please enter Course Code",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="link1"
            label="Class Link"
            rules={[
              {
                required: false,
                message: "Please enter Class Link",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="weekDay"
            label="Week Day"
            rules={[
              {
                required: true,
                message: "Please select a Week Day",
              },
            ]}
          >
            <Select
              placeholder="Select a option and change input text above"
              onChange={(value) => this.setState({ weekDay: value })}
              allowClear
            >
              <Option value="sunday">Sunday</Option>
              <Option value="monday">Monday</Option>
              <Option value="tuesday">Tuesday</Option>
              <Option value="wednesday">Wednesday</Option>
              <Option value="thursday">Thursday</Option>
              <Option value="friday">Friday</Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              style={{ backgroundColor: "#141414" }}
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export { EditClass, EditClassPopupForm };

// export { EditClassPopupForm };