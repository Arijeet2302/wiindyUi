
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7-HxyU-9XEkvoZcafKe2d_us9-AjwE5U",
  authDomain: "wiindy-5c95b.firebaseapp.com",
  projectId: "wiindy-5c95b",
  storageBucket: "wiindy-5c95b.appspot.com",
  messagingSenderId: "1075734441338",
  appId: "1:1075734441338:web:575247045113c03faafac3",
  measurementId: "G-V8J6GCEH64"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();


export { auth , app };