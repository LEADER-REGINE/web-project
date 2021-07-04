import React, { useEffect, useState } from "react";
import firebase, { storage } from "../utils/firebase";
import { BrowserRouter as Router, Link } from "react-router-dom";
import AddPost from "../components/AddPost";

export default function Home() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;
  //states

  const [state, setstate] = useState({
    posts: [],
  });
  const [userdata, setuserdata] = useState({
    user: [],
  });
  //states

  //references
  var usersRef = db.collection("users").doc(UID);
  var postsRef = db.collection("posts");
  var userRef = db.collection("users").doc(UID);
  var batch = db.batch();

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

  /*   useEffect(() => {
    const fetchImg = () => {
      postsRef.orderBy("createdAt", "desc").onSnapshot((doc) => {
        let postList = [];
        doc.forEach((post) => {
          postList.push(post.data());
        });
        setstate({ posts: postList });
      });
    };
    fetchImg(); // eslint-disable-next-line
  }, []); */

  return (
    <div>
      <div>
        <div>
          <AddPost></AddPost>
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
            <img src={states.img_path} alt="hello"></img>
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
