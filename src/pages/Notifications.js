import React, { useEffect, useState } from "react";
import firebase from "../utils/firebase";

export default function Profile() {
  const user = firebase.auth().currentUser;
  const db = firebase.firestore();
  var UID = user.uid;

  const [notifs, setnotifs] = useState({
    notifs: [],
  });

  var notifRef = db.collection("notifications").doc(UID).collection("notifs");
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

  return (
    <div>
      <div>
        <h3>Notifications</h3>
        {notifs.notifs.map((notif) => (
          <div>
            <h1>{notif.value}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
