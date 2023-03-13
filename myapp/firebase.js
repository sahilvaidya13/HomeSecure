import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
const config = initializeApp({
  apiKey: "AIzaSyBknTBdiorjak9WzwIzvhK2hPHptfrlh4M",
  authDomain: "iotsecurity-fc7b4.firebaseapp.com",
  databaseURL: "https://iotsecurity-fc7b4-default-rtdb.firebaseio.com",
  projectId: "iotsecurity-fc7b4",
  storageBucket: "iotsecurity-fc7b4.appspot.com",
  messagingSenderId: "458666501991",
  appId: "1:458666501991:web:2fc43b140eb92e7d4371c2",
  measurementId: "G-3DG5DN1KRN",
});
export const database = getDatabase();
export default config;
