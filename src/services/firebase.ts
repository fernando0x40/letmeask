import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, push } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
const firebaseRef = ref;
const firebasePush = push;

const provider = new GoogleAuthProvider();

export { auth, database, firebaseRef, firebasePush, provider };
