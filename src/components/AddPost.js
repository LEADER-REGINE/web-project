import React, { useState } from "react";
import firebase, { storage } from "../utils/firebase";
var uuid = require("uuid");

export default function ImageUpload() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;
  const id = uuid.v4();
  const [file, setFile] = useState(null);
  const [url, setURL] = useState("");
  const [payload, setPayload] = useState({
    postBody: "",
    heartCtr: 0,
  });

  function handleChange(e) {
    setFile(e.target.files[0]);
  }
  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  //references
  var usersRef = db.collection("users").doc(UID);
  var postsRef = db.collection("posts");
  var userRef = db.collection("users").doc(UID);
  var batch = db.batch();
  const timestamp = firebase.firestore.FieldValue.serverTimestamp;
  //references

  function handleUpload(e) {
    e.preventDefault();
    let date = new Date();
    let postedDate = date.toLocaleString();

    console.log(url);
    userRef.get().then((doc) => {
      let author = doc.data().fname + " " + doc.data().lname;
      let profilePic = doc.data().profilePic;
      batch.set(usersRef.collection("postCollection").doc(id), {
        postBody: payload.postBody,
        heartCtr: payload.heartCtr,
        createdAt: timestamp(),
        postAuthor: author,
        postID: id,
        postedDate: postedDate,
        userID: UID,
        profilePic: profilePic,
      });
      batch.set(postsRef.doc(id), {
        postBody: payload.postBody,
        heartCtr: payload.heartCtr,
        createdAt: timestamp(),
        postAuthor: author,
        postID: id,
        postedDate: postedDate,
        userID: UID,
        profilePic: profilePic,
      });
      batch.commit().then(() => {
        const ref = storage.ref(`/images/${id}/${file.name}`);
        const uploadTask = ref.put(file);
        uploadTask.on("state_changed", console.log, console.error, () => {
          ref.getDownloadURL().then((url) => {
            setFile(null);
            setURL(url);
            usersRef
              .collection("postCollection")
              .doc(id)
              .update({
                img_path: url,
              })
              .then((doc) => {
                postsRef
                  .doc(id)
                  .update({
                    img_path: url,
                  })
                  .then(() => {});
              });
          });
        });
      });
    });
  }

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          label="Body"
          name="postBody"
          onChange={userInput("postBody")}
          value={payload.postBody}
        ></input>
        <input type="file" onChange={handleChange} accept="image/*" />
        <button disabled={!file}>upload to firebase</button>
      </form>
    </div>
  );
}
