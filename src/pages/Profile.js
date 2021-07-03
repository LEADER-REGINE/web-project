import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import AddPost from "../components/AddPost";
var uuid = require("uuid");
export default function Profile() {
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
    postCount: "",
  });
  const [getData, setGetdata] = useState({
    postCount: "",
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
    let isMounted = true;
    const fetchPost = () => {
      postsRef.orderBy("createdAt", "desc").onSnapshot((doc) => {
        if (isMounted) {
          let postList = [];
          doc.forEach((post) => {
            postList.push(post.data());
          });
          setstate({ posts: postList });
        }
      });
    };
    fetchPost(); // eslint-disable-next-line
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchData = () => {
      userRef.collection("postCollection").onSnapshot((snap) => {
        if (isMounted) {
          let size = snap.size; // will return the collection size
          setGetdata({ postCount: size });
        }
      });
    };
    fetchData(); // eslint-disable-next-line
    return () => {
      isMounted = false;
    };
  }, []);

  console.log(getData.postCount);

  const deletePost = (docId) => {
    batch.delete(usersRef.collection("postCollection").doc(docId));
    batch.delete(postsRef.doc(docId));
    batch.commit().then(() => {});
  };

  return (
    <div>
      <div>
        <div>
          <AddPost></AddPost>
        </div>
      </div>
      <div>
        {userdata.user.map((user) => (
          <h1 key={UID}>
            Name: <p>{user.fname + " " + user.lname}</p>
          </h1>
        ))}
      </div>
      <div>
        <h1>
          Posts: <p>{getData.postCount}</p>
        </h1>
      </div>
      <div>
        {state.posts.map((states) => (
          <div key={states.postID}>
            <h1>
              Body: <p>{states.postBody}</p>
              <input
                type="button"
                value="Delete"
                onClick={() => deletePost(states.postID)}
              ></input>
              <input
                type="button"
                value="Heart"
                onClick={() => heartPost(states.postID)}
              ></input>
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}
