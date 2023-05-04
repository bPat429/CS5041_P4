import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js"
import { getDatabase, onChildAdded, get, ref, child, push, serverTimestamp, query, orderByChild, equalTo, limitToLast } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js"
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-functions.js"
import { doc, getDoc, onSnapshot, getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"

let database;
let auth;
let uid;

async function authenticate() {
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
  auth = getAuth(firebaseApp);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
    }
  });
  database = getDatabase(firebaseApp);
  
  const functions = getFunctions(firebaseApp);
  const firebaseToken = "3182ffbb-14f3-46b0-bb5d-466dbf11d960";
  const getToken = httpsCallable(functions, "getToken");
  const token = await getToken({ token: firebaseToken });
  signInWithCustomToken(auth, token.data.token);
  
  const commentsRef = ref(database, 'data');

  const button_5 = query(commentsRef, orderByChild('groupId'), equalTo(20));
  const button_6 = query(commentsRef, orderByChild('groupId'), equalTo(6));
  const button_7 = query(commentsRef, orderByChild('groupId'), equalTo(7));

  let listener_1 = onChildAdded(button_5, function(snapshot) {
    console.log(snapshot.val().groupId);
    console.log(snapshot.val().string);
    console.log(snapshot);
  });

  let listener_2 = onChildAdded(button_6, function(snapshot) {
    console.log(snapshot.val().groupId);
    console.log(snapshot);
  });

  let listener_3 = onChildAdded(button_7, function(snapshot) {
    console.log(snapshot.val().groupId);
    console.log(snapshot);
  });
  
}



function setup(){
    createCanvas(400,400);
    authenticate();
  }

  function draw(){
    if (mouseIsPressed) {
      fill(0);
      push(ref(database, "data"), {
        userId: uid,
        groupId: 20,
        timestamp: serverTimestamp(),
        type: "str",
        string: "test"
      });
    }
    ellipse(mouseX, mouseY, 80, 80);
  }


window.setup = setup;
window.draw = draw;