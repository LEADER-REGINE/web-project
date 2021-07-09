import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import { Link, useHistory } from "react-router-dom";
import "../components/css/Nav.css";

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined';

export default function Nav() {// eslint-disable-next-line
  const [values, setValues] = useState({
    isAuthenticated: false,
  });
  const history = useHistory();
  const logout = (e) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        history.push("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setValues({ isAuthenticated: true });
        let x = document.getElementById("logout");
        x.style.display = "inline";
      } else {
        setValues({ isAuthenticated: false });
        let x = document.getElementById("logout");
        x.style.display = "none";
      }
    });
  }, []);
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/profile" className="aaa">
              <PersonOutlineOutlinedIcon />
              Profile
            </Link>
          </li>
          <li>
            <Link to="/home" className="aaa">
              <HomeOutlinedIcon />
              Home
            </Link>
          </li>
          <li>
            <Link onClick={logout} id="logout" className="aaa">
              <ExitToAppOutlinedIcon />
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
