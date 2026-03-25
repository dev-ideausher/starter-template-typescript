import { initializeApp } from "firebase/app";
import { config } from "@config";

const firebaseConfig = {
  apiKey: config.firebase.client.apiKey,
  authDomain: config.firebase.client.authDomain,
  projectId: config.firebase.client.projectId,
  storageBucket: config.firebase.client.storageBucket,
  messagingSenderId: config.firebase.client.messagingSenderId,
  appId: config.firebase.client.appId,
};

// Initialize Firebase
const firebaseClientApp = initializeApp(firebaseConfig);
export default firebaseClientApp;
