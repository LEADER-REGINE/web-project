import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import EditProfile from "./pages/EditProfile";
import PublicRoute from "./utils/PublicRoute";
import PrivateRoute from "./utils/PrivateRoute";
import firebase from "./utils/firebase";
import Nav from "./components/Nav";

function App() {
  const [values, setValues] = useState({
    isAuthenticated: false,
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setValues({ isAuthenticated: true });
      } else {
        setValues({ isAuthenticated: false });
      }
    });
  }, []);

  return (
    <Router>
      <Nav></Nav>
      <Switch>
        <PublicRoute path="/" component={Landing} restricted={true} exact />
        <PublicRoute
          isAuthenticated={values.isAuthenticated}
          restricted={true}
          component={Login}
          path="/login"
        />
        <PublicRoute
          isAuthenticated={values.isAuthenticated}
          restricted={true}
          component={Register}
          path="/register"
        />
        <PrivateRoute
          isAuthenticated={values.isAuthenticated}
          component={Home}
          path="/home"
        />
        <PrivateRoute
          isAuthenticated={values.isAuthenticated}
          component={Profile}
          path="/profile"
        />
        <PrivateRoute
          isAuthenticated={values.isAuthenticated}
          component={EditProfile}
          path="/editprofile"
        />
      </Switch>
    </Router>
  );
}

export default App;
