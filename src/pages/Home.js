import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";
import AddPost from "../components/AddPost";
import "../components/css/Home.css";

import Heart from "react-animated-heart"; //puso
import Nav from "../components/Nav";

export default function Home() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;

  //puso
  const [isClick, setClick] = useState(false);

  //states
  const [state, setstate] = useState({
    posts: [],
  });
  const [userdata, setuserdata] = useState({
    user: [],
  });

  const [payload, setPayload] = useState({
    comment: "",
    uid: "",
  });
  // eslint-disable-next-line
  const userInput = (prop) => (e) => {
    setPayload({ ...payload, [prop]: e.target.value });
  };

  //states

  //references
  var postsRef = db.collection("posts");
  var userRef = db.collection("users").doc(UID);
  var notifRef = db.collection("notifications");
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
    let date = new Date();
    let likedDate = date.toLocaleString();
    userRef.get().then((doc) => {
      let user = doc.data().fname + " " + doc.data().lname;

      postsRef
        .collection("hearts")
        .doc(UID)
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            postsRef
              .collection("hearts")
              .doc(UID)
              .delete()
              .then(() => {
                postsRef.get().then((doc) => {
                  let heartcount = doc.data().heartCtr;
                  var newheart = heartcount - 1;
                  batch.set(
                    postsRef,
                    {
                      heartCtr: newheart,
                    },
                    { merge: true }
                  );
                  batch.commit().then(() => {});
                });
              });
          } else {
            postsRef
              .collection("hearts")
              .doc(UID)
              .set({
                value: user + " likes this post!",
                likedTime: likedDate,
                createdAt: timestamp(),
              })
              .then(() => {
                postsRef.get().then((doc) => {
                  let useruid = doc.data().userID;
                  notifRef
                    .doc(useruid)
                    .collection("notifs")
                    .doc()
                    .set({
                      value: user + " loves your post!",
                      likedTime: likedDate,
                      createdAt: timestamp(),
                    })
                    .then(() => {
                      postsRef.get().then((doc) => {
                        let heartcount = doc.data().heartCtr;
                        var newheart = heartcount + 1;
                        batch.set(
                          postsRef,
                          {
                            heartCtr: newheart,
                          },
                          { merge: true }
                        );
                        batch.commit().then(() => {});
                      });
                    });
                });
              });
          }
        });
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
    <div className="home-container">
      <div className="nav-container1">
        <Nav></Nav>
      </div>
      <div className="home-left-container">
        <div>
          <div>
            <AddPost></AddPost>
          </div>
        </div>
        <div>
          {userdata.user.map((user) => (
            <h1 key={UID}>
              Hello,
              <p>{user.fname + " " + user.lname}</p>
            </h1>
          ))}
        </div>
      </div>
      <div className="home-post-container">
        {state.posts.map((states) => (
          <div key={states.postID} className="home-post">
            <div className="post-topp">
              <div className="post-top">
                <img src={states.profilePic} alt="Profile" className="post-profilepic" />
                <div>
                  <h4>{states.postAuthor}</h4>
                  <h6>{states.postedDate}</h6>
                </div>
              </div>
              <p className="post-status">{states.postBody}</p>
              <div className="post-image-container">
                <img src={states.img_path} alt="postImg"></img>
              </div>
            </div>
            <div className="post-bot">
              <div className="puso-ctr">{states.heartCtr}</div>

              <div className="puso">
                <Heart
                  value="Heart"
                  isclick={isClick}
                  onClick={() => {
                    heartPost(states.postID);
                    setClick(!isClick);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
