import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Config and initialisation for Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDBjUEw_DQNMQsZJWfTtLL0PQJoH-xF0kk",
    authDomain: "sta-cs5041.firebaseapp.com",
    databaseURL: "https://sta-cs5041-p4.firebaseio.com",
    projectId: "sta-cs5041",
    storageBucket: "sta-cs5041.appspot.com",
    messagingSenderId: "639987847762",
    appId: "1:639987847762:web:c5a35616a1aa1cf243458b"
};


const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export const functions = getFunctions(firebaseApp);

export const database = getDatabase(firebaseApp);

export const firebaseToken = "3182ffbb-14f3-46b0-bb5d-466dbf11d960";