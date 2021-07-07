import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { TextField } from "@material-ui/core";
import "../components/css/Login.css";
import firebase from "../utils/firebase";

import image3 from "../images/image3.png";

export default function Register() {
  const [payload, setPayload] = useState({
    fname: "",
    lname: "",
    email: "",
    gender: "",
    password: "",
    confirmpassword: "",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZNvTWjTSpH6CCYzLPxYkagOsGEZSrk5GMw&usqp=CAU",
  });

  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  const db = firebase.firestore(); // eslint-disable-next-line
  const history = useHistory();
  const register = (e) => {
    if (payload.password !== payload.confirmpassword) {
      alert("Passwords doesn't match! Please try again");
    } else if (payload.password === "" || payload.email === "") {
      alert("Please fill out all of the fields");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then((userCredential) => {
          var user = userCredential.user;
          db.collection("users")
            .doc(user.uid)
            .set({
              fname: payload.fname,
              lname: payload.lname,
              gender: payload.gender,
              uid: user.uid,
              profilePic: payload.profilePic,
            })
            .then((docRef) => {})
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        })
        .catch((error) => {
          var errorMessage = error.message;
          console.log(errorMessage);
        });
    }
  };

  /*return (
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
                label="First Name"
                name="fname"
                onChange={userInput("fname")}
                value={payload.fname}
              ></Mui.TextField>
            </div>
            <div>
              <Mui.TextField
                type="text"
                label="Last Name"
                name="lname"
                onChange={userInput("lname")}
                value={payload.lname}
              ></Mui.TextField>
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
              <Mui.TextField
                type="password"
                label="Confirm Password"
                name="confirmpassword"
                onChange={userInput("confirmpassword")}
                value={payload.confirmpassword}
              ></Mui.TextField>
            </div>
            <div>
              <Mui.Button
                variant="contained"
                color="primary"
                size="large"
                onClick={register}
                className="login-btn"
                startIcon={<Muicons.VpnKey />}
              >
                Login
              </Mui.Button>
            </div>
            <div>
              <h6>
                Already have an account? <a href="/login">Login Here</a>
              </h6>
            </div>
          </div>
        </Mui.Card>
      </Mui.Container>
    </div>
  );*/

  return (
    <div className="login-container">
      <div className="login-item">
        <div className="login-left">
          <div className="image3-container">
            <img src={image3} alt="" className="image3" />
          </div>
        </div>
        <div className="login-right">
          <div className="login-form" noValidate autoComplete="off">
            <h1>Register</h1>
            <div className="login-name">
              <div id="fname">
                <TextField
                  id="outlined-basic"
                  label="First Name"
                  variant="outlined"
                  type="text"
                  name="fname"
                  onChange={userInput("fname")}
                  value={payload.fname}
                  style={{ width: "100%" }}
                />
              </div>

              <div id="lname">
                <TextField
                  id="outlined-basic"
                  type="text"
                  label="Last Name"
                  name="lname"
                  onChange={userInput("lname")}
                  value={payload.lname}
                  variant="outlined"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
            <div id="taena">
              <p className="login-p">Gender</p>
              <div
                onChange={userInput("gender")}
                value={payload.gender}
                id="radio-container"
              >
                <div>
                  <input type="radio" value="Male" name="gender" /> Male
                </div>
                <div>
                  <input type="radio" value="Female" name="gender" /> Female
                </div>
                <div>
                  <input type="radio" value="Other" name="gender" /> Other
                </div>
              </div>
            </div>
            <div id="taena">
              <TextField
                id="outlined-basic"
                type="text"
                label="E-mail"
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
                type="password"
                label="Password"
                name="password"
                onChange={userInput("password")}
                value={payload.password}
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>

            <div id="taena">
              <TextField
                type="password"
                label="Confirm Password"
                name="confirmpassword"
                onChange={userInput("confirmpassword")}
                value={payload.confirmpassword}
                variant="outlined"
                style={{ width: "100%" }}
              />
            </div>

            <div id="taena">
              <button onClick={register} className="reg-btn">
                Register
              </button>
            </div>
            <div id="taena-alr">
              <div>
                <p className="login-p">Already have an account? </p>

                <Link to="/login" className="btn btn-primary">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
