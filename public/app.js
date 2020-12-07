/*
const firebaseConfig = {
  apiKey: "AIzaSyC5P3NmqxPDFfb7F81co7VDQPLdS0BYxSY",
  authDomain: "hasalatech-14b00.firebaseapp.com",
  databaseURL: "https://hasalatech-14b00.firebaseio.com",
  projectId: "hasalatech-14b00",
  storageBucket: "hasalatech-14b00.appspot.com",
  messagingSenderId: "855949160154",
  appId: "1:855949160154:web:09151a859c57732f46ffe3",
  measurementId: "G-LN6QHQZGNY"
}
firebase.initializeApp(firebaseConfig)
*/

document.addEventListener("DOMContentLoaded", event => {
  const fbApp = firebase.app()
  
})

const auth = firebase.auth() 

const provider = new firebase.auth.GoogleAuthProvider();




   
 

$("#register").click(function(){

console.log("is this thing on?")
var email = $("#email").innerHTML
var password = $("#password").innerHTML
console.log(email)
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch(function(error) {
// Handle Errors here.
var errorCode = error.code;
var errorMessage = error.message;
if (errorCode == 'auth/weak-password') {
  alert('The password is too weak.');
} else {
  alert(errorMessage);
}
console.log(error);
});
   
  });


  $("#logout").click(function(){
 
    console.log("bruh")
    auth.signOut()
    window.location.href = "/"
   
    });









	

 

