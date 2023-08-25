import React, { useState } from 'react';
import './styles/SemesterSelector.css';

const SemesterSelector = ({ onChange }) => {
  const semesters = ['Odd', 'Even'];
  const [selectedSemester, setSelectedSemester] = useState('');

  const handleSemesterChange = (event) => {
    const selectedSemester = event.target.value;
    setSelectedSemester(selectedSemester);
    onChange(selectedSemester);
  };

  return (
    <div className="container">
      <div className="left-column">
        <label htmlFor="semester">Semester</label>
      </div>
      <div className="right-column">
        <select id="semester" value={selectedSemester} onChange={handleSemesterChange}>
          <option value="">Select Option</option>
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SemesterSelector;
