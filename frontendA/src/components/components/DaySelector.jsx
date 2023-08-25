import React from 'react';
import './styles/DaySelector.css';

const DaySelector = ({ onChange }) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const handleDayChange = (event) => {
    const selectedDay = event.target.value;
    onChange(selectedDay);
  };

  return (
    <div className="day-selector-container">
      <div className="label-box">
        <label htmlFor="day" className="day-label">
          Day
        </label>
      </div>
      <div className="day-select-container">
        <select id="day" className="day-select" onChange={handleDayChange}>
          <option value="">Select Day</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DaySelector;
