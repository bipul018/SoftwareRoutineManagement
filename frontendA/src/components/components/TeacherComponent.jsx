import React, { useState, useEffect } from "react";
import "./styles/TeacherComponent.css";
import { apiTeacherUrl } from "../../utils/utils";
import axios from "axios";

const TeachersList = ({ selectedTeacher, onChange }) => {
  const [teacherList, setTeacherList] = useState([]);

  const handleTeacherChange = (e) => {
    const selectedTeacher = e.target.value;
    onChange(selectedTeacher);
  };

  useEffect(() => {
  
    const fetchTeachers = async () => {
      try {
        const { data } = await axios.get(apiTeacherUrl);
        setTeacherList(data.data.map((teacher) => teacher.teacherName));
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div className="container">
      <div className="left-column">
        <label>Teacher's Name</label>
      </div>
      <div className="right-column">
        <select value={selectedTeacher} onChange={handleTeacherChange}>
          <option value="">Select a teacher...</option>
          {teacherList.map((teacher, index) => (
            <option key={index} value={teacher}>
              {teacher}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TeachersList;
