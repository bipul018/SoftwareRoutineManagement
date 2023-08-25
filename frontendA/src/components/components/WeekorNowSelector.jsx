import React, { useState, useEffect } from 'react';
import './styles/WeekorNowSelector.css';

const WeekorNowSelector = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState('daily');

  const handleOptionChange = (event) => {
    const selectedOption = event.target.value;
    setSelectedOption(selectedOption);
    onChange(selectedOption);
  };

  useEffect(() => {
    onChange(selectedOption); // Notify parent component with default value on initial render
  }, []);

  return (
    <div className="container">
      <label htmlFor="option" className="label">Smart Labels</label>
      <select id="option" onChange={handleOptionChange} value={selectedOption} className="select">
        <option value="daily">daily</option>
        <option value="week">Week</option>
        <option value="now">Now</option>
      </select>

      {selectedOption && <div className="selected-option">You selected {selectedOption}</div>}
    </div>
  );
};

export default WeekorNowSelector;
