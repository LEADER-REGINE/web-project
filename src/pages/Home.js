import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import { BrowserRouter as Router, Link } from "react-router-dom";
var uuid = require("uuid");
export default function Home() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  const id = uuid.v4();
  var UID = user.uid;
  //states
  const [payload, setPayload] = useState({
    postBody: "",
    heartCtr: 0,
  });
  const [state, setstate] = useState({
    posts: [],
  });
  const [userdata, setuserdata] = useState({
    user: [],
  });
  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };
  //states

  //references
  var usersRef = db.collection("users").doc(UID);
  var postsRef = db.collection("posts");
  var userRef = db.collection("users").doc(UID);
  var batch = db.batch();
  const timestamp = firebase.firestore.FieldValue.serverTimestamp;
  //references

  useEffect(() => {
    const fetchUser = () => {
      userRef.get().then((doc) => {
        let userList = [];
        userList.push(doc.data());
        setuserdata({ user: userList });
      });
    };
    fetchUser(); // eslint-disable-next-line
  }, []);
  const createPost = (e) => {
    userRef.get().then((doc) => {
      let author = doc.data().fname + " " + doc.data().lname;
      batch.set(usersRef.collection("postCollection").doc(id), {
        postBody: payload.postBody,
        heartCtr: payload.heartCtr,
        createdAt: timestamp(),
        postAuthor: author,
        postID: id,
      });
      batch.set(postsRef.doc(id), {
        postBody: payload.postBody,
        heartCtr: payload.heartCtr,
        createdAt: timestamp(),
        postAuthor: author,
        postID: id,
      });
      batch.commit().then(() => {});
    });
  };

  const heartPost = (docId) => {
    var postsRef = db.collection("posts").doc(docId);
    postsRef.get().then((doc) => {
      let heartcount = doc.data().heartCtr;
      var newheart = heartcount + 1;
      batch.update(postsRef, {
        heartCtr: newheart,
      });
      batch.commit().then(() => {});
    });
  };

  useEffect(() => {
    const fetchPost = () => {
      postsRef.orderBy("createdAt", "desc").onSnapshot((doc) => {
        let postList = [];
        doc.forEach((post) => {
          postList.push(post.data());
        });
        setstate({ posts: postList });
      });
    };
    fetchPost(); // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div>
        <div>
          <input
            type="text"
            label="Body"
            name="postBody"
            onChange={userInput("postBody")}
            value={payload.postBody}
          ></input>
        </div>
        <div>
          <button onClick={createPost}>Add Post</button>
        </div>
      </div>
      <div>
        {userdata.user.map((user) => (
          <Router>
            <h1 key={UID}>
              Hello, <Link to="/profile">{user.fname + " " + user.lname}</Link>
            </h1>
          </Router>
        ))}
      </div>
      <div>
        {state.posts.map((states) => (
          <div key={states.postID}>
            <h1>
              Content: <p>{states.postBody}</p>
            </h1>
            <h6>
              Posted by <p>{states.postAuthor}</p>
            </h6>
            <h6>
              Hearts: <p>{states.heartCtr}</p>
            </h6>
            <input
              type="button"
              value="Heart"
              onClick={() => heartPost(states.postID)}
            ></input>
          </div>
        ))}
      </div>
    </div>
  );
}
