import React, { useState } from 'react';
import './styles/SectionSelector.css';

const SectionSelector = ({ onChange }) => {
  const faculties = [
    { name: 'Civil', sections: ['AB','CD','EF','GH'], years: 4 },
    { name: 'Electrical', sections: ['AB'], years: 4 },
    { name: 'Computer', sections: ['AB', 'CD'], years: 4 },
    { name: 'Electronics', sections: ['AB'], years: 4 },
    { name: 'Aerospace', sections: ['AB'], years: 4 },
    { name: 'Mechanical', sections: ['AB'], years: 4 },
    { name: 'Architecture', sections: ['AB'], years: 5 },
  ];

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const handleFacultyChange = (event) => {
    const selectedFaculty = event.target.value;
    setSelectedFaculty(selectedFaculty);
    setSelectedSection('AB'); // Reset selected section when faculty changes
    setSelectedYear(1); // Reset selected year when faculty changes

    // Pass selected options to parent component using onChange prop
    onChange({
      faculty: selectedFaculty,
      section: 'AB', // Update with the selected section if applicable
      year: 1, // Update with the selected year if applicable
    });
  };

  const handleSectionChange = (event) => {
    const selectedSection = event.target.value;
    setSelectedSection(selectedSection);

    // Pass selected options to parent component using onChange prop
    onChange({
      faculty: selectedFaculty,
      section: selectedSection,
      year: selectedYear,
    });
  };

  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    setSelectedYear(selectedYear);

    // Pass selected options to parent component using onChange prop
    onChange({
      faculty: selectedFaculty,
      section: selectedSection,
      year: selectedYear,
    });
  };

  const selectedFacultySections = selectedFaculty ? faculties.find((faculty) => faculty.name === selectedFaculty).sections : [];
  const selectedFacultyYears = selectedFaculty ? faculties.find((faculty) => faculty.name === selectedFaculty).years : 0;

 
  return (
    <div className="section-selector-container">
      <div className="option-row">
        <div className="option-label1">Faculty</div>
        <div className="select-container">
          <select id="faculty" className="faculty-select" onChange={handleFacultyChange}>
            <option value="">Select Faculty</option>
            {faculties.map((faculty) => (
              <option key={faculty.name} value={faculty.name}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>
        {selectedFaculty && (
          <div className="option-label">Section</div>
        )}
        {selectedFaculty && (
          <div className="select-container">
            <select id="section" className="section-select" onChange={handleSectionChange}>
              <option value="">Select section</option>
              {selectedFacultySections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedFaculty && (
          <div className="option-label">Year</div>
        )}
        {selectedFaculty && (
          <div className="select-container">
            <select id="year" className="year-select" onChange={handleYearChange}>
              <option value="">Select year</option>
              {[...Array(selectedFacultyYears)].map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionSelector;
