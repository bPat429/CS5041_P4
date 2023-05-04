import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js"
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js"
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-functions.js"

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
const auth = getAuth(firebaseApp);
const database = getDatabase(firebaseApp);
// 
const functions = getFunctions(firebaseApp);
const firebaseToken = "3182ffbb-14f3-46b0-bb5d-466dbf11d960";
const getToken = httpsCallable(functions, "getToken");
const token = await getToken({ token: firebaseToken });
signInWithCustomToken(auth, token.data.token);