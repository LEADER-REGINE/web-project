import React, { useState } from "react";
import firebase, { storage } from "../utils/firebase";
import { useHistory } from "react-router-dom";

export default function ImageUpload() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;
  const [file, setFile] = useState(null);
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

  //references
  var usersRef = db.collection("users").doc(UID);

  var batch = db.batch();
  //references

  function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      usersRef.get().then((doc) => {
        batch.update(usersRef, {
          fname: payload.fname,
          lname: payload.lname,
          profilePic:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhZNvTWjTSpH6CCYzLPxYkagOsGEZSrk5GMw&usqp=CAU",
        });
      });
    } else {
      usersRef.get().then((doc) => {
        batch.update(usersRef, {
          fname: payload.fname,
          lname: payload.lname,
        });
        batch.commit().then(() => {
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
                  history.push("/profile");
                });
            });
          });
        });
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          label="First name"
          name="fname"
          onChange={userInput("fname")}
          value={payload.fname}
        ></input>
        <input
          type="text"
          label="Last Name"
          name="lname"
          onChange={userInput("lname")}
          value={payload.lname}
        ></input>
        <input type="file" onChange={handleChange} accept="image/*" />
        <button disabled={!file}>Update Profile</button>
      </form>
    </div>
  );
}
