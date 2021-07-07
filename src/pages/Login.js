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
    /*
    <div className="login-card">
      <Mui.Container maxWidth="xs">
        <Mui.Card>
          <div className="card-inside">
            <div>
              <Muicons.AccountBox style={{ fontSize: 58 }} />
            </div>
            <div>
              <Mui.TextField
                type="text"
                label="E-mail"
                name="email"
                onChange={userInput("email")}
                value={payload.email}
              ></Mui.TextField>
            </div>
            <div>
              <Mui.TextField
                type="password"
                label="Password"
                name="password"
                onChange={userInput("password")}
                value={payload.password}
              ></Mui.TextField>
            </div>
            <div>
              <Mui.Button
                variant="contained"
                color="primary"
                size="large"
                onClick={signin}
                className="login-btn"
                startIcon={<Muicons.VpnKey />}
              >
                Login
              </Mui.Button>
            </div>
            <div>
              <h6>
                Don't have an account yet? <a href="/register">Register Now</a>
              </h6>
            </div>
          </div>
        </Mui.Card>
      </Mui.Container>
    </div>
    */

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
              <button className="login-btn" onClick={signin}>
                Log In
              </button>
            </div>

            <div id="taena">
              <Link to="/register" className="reg-btn">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
