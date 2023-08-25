// RoutineSelectionComponent.js
import React, { forwardRef,useState, useImperativeHandle,useEffect } from 'react';
import SemesterSelector from '../../components/components/SemesterSelector';
import SectionSelector from '../../components/components/SectionSelector';
import ViewRoutineButton from '../../components/components/ViewRoutine';
import TeachersList from '../components/TeacherComponent';
import axios from 'axios';
// import apihandler from './apiHandler';
import AddTeacherButton from '../components/AddTeacher';
import AddSubjectButton from '../components/AddSubject';
import { apiClassUrl, apiProgramUrl, apiTeacherUrl } from "../../utils/utils";
import Teacher from '../../pages/Teacher/Teacher';
import './RoutineSelectionComponent.css'



// import styles from './RoutineSelectionComponent.css'; // Import the CSS styles
const RoutineSelectionComponent = forwardRef(({setSelectedOptionsParent, setResponseParent, setIsTeacherParent},ref) => {
    const [isSelectionComplete, setSelectionComplete] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [routineData, setRoutineData] = useState([]);
    const [isTeacherSelected, setTeacherSelected] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(''); // Track the selected teacher
    const [selectedProgramID, setSelectedProgramID] = useState();
  
  
    //added async keywordto satisfy await in calling the api handler
    const handleButtonClick = async () => {

      setSelectedData();
      setSelectionComplete(true);
      // if (!isSelectionComplete) {
      //   console.log('Please select all options');
      //   return;  
      // }
      console.log(selectedOptions.section?.year);
      console.log(selectedOptions.semester);
      console.log(selectedOptions.section?.section);
      console.log(selectedOptions.section?.faculty);
      console.log(typeof(selectedOptions.section?.faculty));
      console.log(selectedOptions.teacherOptions);
      //To get out request according to schema in backend 
      const programShortForm = {
        Civil: 'BCE',
        Computer: 'BCT',
        Electrical: 'BEL',
        Electronics: 'BEI',
        Aerospace: 'BAS',
        Mechanical: 'BME',
        Architecture: 'B.Arch',
      };
      const changeSemester = {
        Odd: 'I',
        Even: 'II',
      } 
      const changeYeartoNumber = {
        1 : 1,
        2 : 2,
        3 : 3,
        4: 4,
        5: 5,
      }
      const requestData = {
        "program": programShortForm[selectedOptions.section?.faculty],
        "year": changeYeartoNumber[selectedOptions.section?.year],
        "part": changeSemester[selectedOptions.semester],
        "section": selectedOptions.section?.section,
        "routineDuration": "weekly",
        "day": "Sunday",
      }; 
      console.log(requestData);
      setSelectedOptionsParent(requestData);
      setIsTeacherParent(isTeacherSelected);
      try {
        const programName = requestData.program;
        const year = requestData.year;
        const part = requestData.part;
        const section = requestData.section;
        const programParams = `/programName/${programName}/year/${year}/part/${part}/section/${section}`;
        let programRes = await axios.get(apiProgramUrl + programParams);
        let id = programRes.data.data;
        
        let programIDparam = `/program/${id}`
        if (requestData.routineDuration == 'weekly'){
          programIDparam = programIDparam + `/weekly`
        }
        else if (requestData.routineDuration == 'daily'){
          programIDparam = programIDparam + `/daily/${requestData.day}`
        }
        let {data:res} = await axios.get(apiClassUrl + programIDparam);
        console.log(res.data)
        setResponseParent(res);
        setSelectedProgramID(id)
      
      } catch (error) {
        console.error('Error:', error);
      }
   
    };

    //added async keywordto satisfy await in calling the api handler
    useImperativeHandle(ref,() => ({
      handleButtonClick
    }));

    const handleTeacherButtonClick = async () => {
      setSelectedData();
      setSelectionComplete(true);
      console.log(selectedOptions.teacherOptions);
      setIsTeacherParent(isTeacherSelected);
      try {
        const teacherName = selectedOptions.teacherOptions;
        const {data:res} = await axios.get(apiTeacherUrl + `/name/${teacherName}`);

        const teacherID = res.data;
        const {data:classesRes} = await axios.get(apiClassUrl + `/teacher/${teacherID}`)
        setResponseParent(classesRes);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const setSelectedData = () => {
      setSelectedOptions(selectedOptions);
      setSelectedTeacher(selectedOptions.teacherOptions);
    };
  
    // Determine if all options are selected
    const areAllOptionsSelected =
      selectedOptions.section?.year &&
      selectedOptions.semester &&
      selectedOptions.section?.section &&
      selectedOptions.section?.faculty;
    //When teacher Routine is to be viewed
    const isTeacherNameSelected = selectedOptions.teacherOptions;
    
      return (
      <div className="home-container">
        <div className="table-container">
          <div className="options-column">
            <h2 className="column-heading">Options</h2>
            <div>
            {/* Radio buttons for selecting Teacher or Student */}
            <label>
              <input
                type="radio"
                value="student"
                checked={!isTeacherSelected} // Student is the default selection
                onChange={() => setTeacherSelected(false)}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="teacher"
                checked={isTeacherSelected}
                onChange={() => {
                  setTeacherSelected(true); 
                }}
              />
              Teacher
            </label>
          </div>
          
          <div className="option-row">
              {/* Render SectionSelector if Student is selected, else render TeacherComponent */}
              {isTeacherSelected ? (
                <TeachersList
                  selectedOptions={selectedOptions} // Pass selectedOptions to TeacherComponent
                  onChange={(teacherOptions) => setSelectedOptions((prevState) => ({ ...prevState, teacherOptions }))}
                />
              ) : (
                <>
                <div>
                  <SectionSelector
                    onChange={(section) => setSelectedOptions((prevState) => ({ ...prevState, section }))}
                  />
                </div>
                <div>
                  <SemesterSelector
                    onChange={(semester) => setSelectedOptions((prevState) => ({ ...prevState, semester }))}
                  />
                </div>
                </>
              )}

          </div>
          <div className="viewRoutineWrapper">
              {isTeacherSelected ? (
                <ViewRoutineButton onClick={handleTeacherButtonClick} disabled={!isTeacherNameSelected} />
              ) : (
                <ViewRoutineButton onClick={handleButtonClick} disabled={!areAllOptionsSelected} />
                // <ViewRoutineButton onClick={handleButtonClick} />
              )} 
          </div>
          </div>
          <div className="addButtonsWrapper">
            <div className="addTeacher">

           <AddTeacherButton />
            </div>
            <div className="addSubject">

          <AddSubjectButton />
            </div>
        </div>
        </div>
      </div>
    );
  });
  export default RoutineSelectionComponent;