import React, { useState } from "react";
import firebase from "../utils/firebase";
import { Route, Link } from "react-router-dom";

export default function Landing() {
  return (
    <Route>
      <div>
        <h1>Hello</h1>
        <Link to="/login">Login</Link>
      </div>
    </Route>
  );
}
