import React, { useState, useEffect } from "react";
import firebase, { storage } from "../utils/firebase";
import { useHistory } from "react-router-dom";
import { TextField } from "@material-ui/core";

import "../components/css/EditProfile.css";
import Nav from "../components/Nav";

export default function ImageUpload() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;
  const [file, setFile] = useState(null); // eslint-disable-next-line
  const [url, setURL] = useState("");
  const history = useHistory();
  const [payload, setPayload] = useState({
    fname: "",
    lname: "",
  });

  function handleChange(e) {
    setFile(e.target.files[0]);
  }
  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };
  const [userdata, setuserdata] = useState({
    user: [],
  });

  //references
  var usersRef = db.collection("users").doc(UID);

  var batch = db.batch();
  //references
  useEffect(() => {
    const fetchUser = () => {
      usersRef.get().then((doc) => {
        let userList = [];
        userList.push(doc.data());
        setuserdata({ user: userList });
      });
    };
    fetchUser(); // eslint-disable-next-line
  }, []);
  function updatePic(e) {
    e.preventDefault();
    const ref = storage.ref(`/profile/images/${UID}/${file.name}`);
    const uploadTask = ref.put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      ref.getDownloadURL().then((url) => {
        setFile(null);
        setURL(url);
        usersRef
          .set(
            {
              profilePic: url,
            },
            { merge: true }
          )
          .then((doc) => {
            alert("profile update success");
            history.push("/profile");
          });
      });
    });
  }
  function handleUpload(e) {
    e.preventDefault();
    if (!payload.fname || !payload.lname) {
      alert("please fill all the fields");
    } else {
      usersRef.get().then((doc) => {
        batch.update(usersRef, {
          fname: payload.fname,
          lname: payload.lname,
        });
        batch.commit().then(() => {
          alert("profile update success");
          history.push("/profile");
        });
      });
    }
  }

  return (
    <div className="EditProfile-container">
      {/* <div className="nav-container1">

        <Nav></Nav>
      </div> */}
      <div className="EditProfile-1">
        {userdata.user.map((user) => (
          <div>
            <img src={user.profilePic} className="EditProfile-img" />
          </div>
        ))}

        <form onSubmit={updatePic}>
          <input type="file" onChange={handleChange} accept="image/*" />
          <button disabled={!file}>Upload</button>
        </form>
      </div>
      <div className="EditProfile-1">
        <form onSubmit={handleUpload}>

          <TextField
            id="outlined-basic"
            type="text"
            label="First Name"
            name="fname"
            onChange={userInput("fname")}
            value={payload.fname}
            variant="outlined"
            value={payload.fname}
            style={{ width: "100%" }}
          />

          <TextField
            id="outlined-basic"
            type="text"
            label="Last Name"
            name="lname"
            onChange={userInput("lname")}
            value={payload.fname}
            variant="outlined"
            value={payload.lname}
            style={{ width: "100%" }}
          />

          <button>Update Profile</button>
        </form>
      </div>
    </div>
  );
}
