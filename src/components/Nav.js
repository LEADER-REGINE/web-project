import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import { Link, useHistory } from "react-router-dom";

export default function Nav() {
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
        var x = document.getElementById("logout");
        x.style.display = "inline";
      } else {
        setValues({ isAuthenticated: false });
        var x = document.getElementById("logout");
        x.style.display = "none";
      }
    });
  }, []);
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link onClick={logout} id="logout">
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
