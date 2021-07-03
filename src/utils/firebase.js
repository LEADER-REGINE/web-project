import firebase from "firebase";
import "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF93trrfIMMWJT-Sf9lX5pbQWwrUXfGmY",
  authDomain: "bsit-act-4.firebaseapp.com",
  projectId: "bsit-act-4",
  storageBucket: "bsit-act-4.appspot.com",
  messagingSenderId: "789359213036",
  appId: "1:789359213036:web:d5bd0026e2a699e692e8c9",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export { storage, firebase as default };
