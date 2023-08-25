import React from "react";
import { Button } from "antd";
import { useNavigate } from "@reach/router";

const AddSubjectButton = () => {
  const navigate = useNavigate();

  const handleAddSubjectClick = () => {
    navigate("/user/admin/addSubject");
  };

  return (
    <div>
      <Button type="primary" onClick={handleAddSubjectClick}>
        Add Subject
      </Button>
    </div>
  );
};

export default AddSubjectButton;

