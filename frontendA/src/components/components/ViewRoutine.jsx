import React from 'react';
import './styles/ViewRoutineButton.css';
const ViewRoutineButton = ({ onClick, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      console.log("Hello");
      onClick();
    }
  };

  return (
    <button className="view-routine-button" onClick={handleClick} disabled={disabled}>
      View Routine
    </button>
  );
};

export default ViewRoutineButton;
