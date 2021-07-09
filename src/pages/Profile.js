import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import AddPost from "../components/AddPost";
import { Link } from "react-router-dom";

import Ellipse25 from "../images/Ellipse25.png";
import Nav from "../components/Nav";


import "../components/css/Profile.css";

var uuid = require("uuid");
export default function Profile() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore(); // eslint-disable-next-line
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
  const [notifs, setnotifs] = useState({
    notifs: [],
  });
  const [userdata, setuserdata] = useState({
    user: [],
    postCount: "",
  });
  const [getData, setGetdata] = useState({
    postCount: "",
  }); // eslint-disable-next-line
  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };
  //states

  //references
  var usersRef = db.collection("users").doc(UID);
  var postsRef = db.collection("posts");
  var userRef = db.collection("users").doc(UID);
  var notifRef = db.collection("notifications").doc(UID).collection("notifs");
  var batch = db.batch(); // eslint-disable-next-line
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

  useEffect(() => {
    let isMounted = true;
    const fetchPost = () => {
      userRef
        .collection("postCollection")
        .orderBy("createdAt", "desc")
        .onSnapshot((doc) => {
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
    }; // eslint-disable-next-line
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
    }; // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchNotification = () => {
      notifRef.orderBy("createdAt", "desc").onSnapshot((doc) => {
        let notifList = [];
        doc.forEach((notif) => {
          notifList.push(notif.data());
        });
        setnotifs({ notifs: notifList });
      });
    };
    fetchNotification(); // eslint-disable-next-line
  }, []);

  const deletePost = (docId) => {
    batch.delete(usersRef.collection("postCollection").doc(docId));
    batch.delete(postsRef.doc(docId));
    batch.commit().then(() => { });
  };

  return (

    <div className="profile-container1">
      <div className="nav-container1">

        <Nav></Nav>
      </div>

      <div className="profile-container">

        <div>
          <div>
            {userdata.user.map((user) => (
              <div className="profile-top">

                <img src={Ellipse25} />

                <div className="profile-top1">
                  <div className="profile-top2">
                    <div>
                      <h1 key={UID}>
                        <p>{user.fname + " " + user.lname}</p>
                      </h1>
                    </div>
                    <Link to="/editprofile" className="profile-edit">Edit</Link>
                  </div>
                  <div className="profile-top3">
                    <h1>
                      <p>Posts: {getData.postCount}</p>
                    </h1>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div className="home-post-container">
            <h1 className="recent">Recent Posts</h1>
            {state.posts.map((states) => (
              <div key={states.postID} className="home-post">

                <div className="post-topp">
                  <div className="post-top">
                    <img src={states.profilePic} className="post-profilepic" />
                    <div>
                      <h4>{states.postAuthor}</h4>
                      <h6>{states.postedDate}</h6>
                    </div>
                    <input
                      type="button"
                      value="Delete"
                      onClick={() => deletePost(states.postID)}
                    ></input>
                  </div>
                  <p className="post-status">{states.postBody}</p>
                  <div className="post-image-container">
                    <img src={states.img_path} alt="hello"></img>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h3>Notifications</h3>
            {notifs.notifs.map((notif) => (
              <div>
                <h1>{notif.value}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
