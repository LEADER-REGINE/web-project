import React from "react";
import firebase from "../utils/firebase";
import { Link, useHistory } from "react-router-dom";

export default function Nav() {
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
            <Link onClick={logout}>Logout</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
