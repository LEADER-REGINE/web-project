import React from "react";
import { Route, Link } from "react-router-dom";

import Nav from "../components/Nav";

export default function Landing() {
  return (
    <Route>
      <div>
      <Nav></Nav>
        <h1>Hello</h1>
        <Link to="/login">Login</Link>
      </div>
    </Route>
  );
}
