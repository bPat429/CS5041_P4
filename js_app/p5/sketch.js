import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getAuth, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js"
import { getDatabase, onChildAdded, get, ref, child, push, serverTimestamp, query, orderByChild, equalTo, limitToLast } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js"
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-functions.js"
import { doc, getDoc, onSnapshot, getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js"

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
  const auth = getAuth(firebaseApp);
  const database = getDatabase(firebaseApp);
  // 
  const functions = getFunctions(firebaseApp);
  const firebaseToken = "3182ffbb-14f3-46b0-bb5d-466dbf11d960";
  const getToken = httpsCallable(functions, "getToken");
  const token = await getToken({ token: firebaseToken });
  signInWithCustomToken(auth, token.data.token);
  
  
  // const [snapshots, dbLoading, dbError] = useList(user ? query(ref(database, 'data'), orderByChild('groupId'), equalTo(20)) : null);

  const dbRef = ref(database);
  // get(child(dbRef, `data`), orderByChild('groupId'), equalTo(24), limitToLast(3)).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     console.log(snapshot);
  //     console.log(snapshot.val());
  //     snapshot.val().forEach(el => console.log(el));
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });

  const commentsRef = ref(database, 'data');

  const old = query(commentsRef, orderByChild('groupId'), equalTo(5));

  // const r1 = (child(dbRef, `data`), orderByChild('groupId'));


  // onChildAdded(r1, (data) => {
  //   // if (data.val().groupId > 4 && data.val().groupId < 8) {
  //     console.log("new post");
  //     console.log(data);
  //     console.log(data.val().groupId);
  //     console.log(data.key)
  //     console.log(data.val().text)
  //   // }
  // });

  let listener = onChildAdded(old, function(snapshot) {
    console.log(snapshot.val().groupId);
    console.log(snapshot);
  });


  
  // const db = getFirestore(firebaseApp);

  // const docSnap = await getDoc(doc(db));
  // console.log(docSnap);



  // const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
  //   console.log("Current data: ", doc.data());
  // });
}


function gotData (data) {
  console.log(data.val());
var scores = data.val();
  var keys = Object.keys(scores);
  console.log(keys);

// for (var i = 0; i < keys.length; i++) {
//   var k = keys[i];
//     var submittedScore = scores[k].score;
//     var submittedName = scores[k].name;
//     console.log("Key: " + k + "   Score: " + submittedScore + "   Name: " + submittedName);
// }
}

function setup(){
    createCanvas(400,400);
    authenticate();
  }

  function draw(){
    ellipse(mouseX, mouseY, 80, 80);
  }


window.setup = setup;
window.draw = draw;