import React, { useState } from "react";
import firebase from "../utils/firebase";
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import "../components/css/Login.css";
import image3 from "../images/image3.png";

export default function Login() {
  const [payload, setPayload] = useState({
    email: "",
    password: "",
  });

  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  const signin = (e) => {
    if (!payload.email || !payload.password) {
      alert("Make sure all fields are filled");
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          // Signed in
          // ...
        })
        .catch((error) => {
          var errorMessage = error.message;
          console.log(errorMessage);
        });
    }
  };

  return (
    <div className="login-container">
      <div className="login-item">
        <div className="login-left">
          <div className="image3-container">
            <img src={image3} alt="background" className="image3" />
          </div>
        </div>
        <div className="login-right">
          <div className="login-form">
            <h1>Login</h1>

            <div id="taena">
              <TextField
                id="outlined-basic"
                type="text"
                label="Email"
                name="email"
                onChange={userInput("email")}
                value={payload.email}
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>

            <div id="taena">
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                type="password"
                name="password"
                onChange={userInput("password")}
                value={payload.password}
                style={{ width: "100%" }}
              />
            </div>

            <div id="taena">
              <h6>Forgot password?</h6>
            </div>

            <div id="taena">
              <button className="login-btn" onClick={signin} id="cursor">
                Log In
              </button>
            </div>

            <div id="taena1">
              <Link to="/register">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
