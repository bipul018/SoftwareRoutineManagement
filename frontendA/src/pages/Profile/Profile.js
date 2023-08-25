import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../../components/Contexts/UserContext";
import "./Profile.css";
import profilePhoto from "./lnr.png";

function ProfileCard() {
  const { user } = useContext(UserContext);
  const [username] = useState(user);

  useEffect(() => {
    // Check if the current route is /routine
    if (window.location.pathname === "/routine") {
      // Reload the page
      window.location.reload();
    }
  }, []);

  const handleViewRoutine = () => {
    // No need to use window.location.reload() here
  };

  return (
    <div className="ProfileCard">
      <div className="left-content">
        <div className="image-container">
          <img src={profilePhoto} alt="" height="200px" width="200px" />
        </div>
        <div className="profile-info">
          <h1>
            <font color="#2566bb" />
            ID: LNR
          </h1>
          <h2>Lokh Nath Regmi</h2>
          <h3 id="dept">Department of Computer and Electronics Engineering</h3>
          <h1>{username}</h1>
        </div>
      </div>

      <div className="right-content">
        <Router>
          <Link to="/routine">
            <button onClick={handleViewRoutine} className="btn">
              View Routine
            </button>
          </Link>
        </Router>
      </div>
    </div>
  );
}

export default ProfileCard;
