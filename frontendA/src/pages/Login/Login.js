import React, { useState } from "react";
// import { Redirect } from "@reach/router";
import axios from "axios";
// import { UserContext } from "../../components/Contexts/UserContext";
import "./Login.css";
import { backendUrl } from "../../utils/utils";

export default function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  // const { user, setUser } = useContext(UserContext);

  axios.defaults.withCredentials = true;
  // axios.defaults.headers.common["x-auth-token"];

  function handleUsernameInput(event) {
    setUsername(event.target.value);
  }

  function handlePasswordInput(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { data: userData } = await axios({
      method: "POST",
      data: { username, password },
      withCredentials: true,
      url: backendUrl + "/user/login",
    });

    if (userData) {
      localStorage.setItem("user", userData.username);
      // setUser(userData.username);
      // console.log("context user: ", user);
      window.location = "/user/profile";
    }
  }

  return (
    <div>
      <div id="wrap" className="wrapper">
        <div className="title">Login</div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <input
              type="text"
              required
              onChange={handleUsernameInput}
              autoFocus
            />
            <label>User Name</label>
          </div>

          <div className="field">
            <input type="password" required onChange={handlePasswordInput} />
            <label>Password</label>
          </div>

          <div className="content">
            <div className="checkbox">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            <div className="pass-link">
              <a href="/login">Forgot password?</a>
            </div>
          </div>

          <div className="field">
            <input type="submit" value="Login" />
          </div>
          <div className="signup-link">
            Not a member? <a href="/login">Signup now</a>
          </div>
        </form>
      </div>
    </div>
  );
}
