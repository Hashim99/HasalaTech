/*const express = require('express')
const app = express();
const port = 5000
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("styling"))

const firebase = require('firebase');


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
firebase.initializeApp(firebaseConfigs)
*/

document.addEventListener("DOMContentLoaded", event => {
  const fbApp = firebase.app()
  console.log(fbApp)
})

const auth = firebase.auth() 

/*app.get('/', (req, res) => {
  res.sendFile(__dirname+"/index.html")
  
})

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname+"/index.html")
  
})



app.get('/login', (req, res) => {
  res.sendFile(__dirname+"/login.html")
  
})

app.get('/login.html', (req, res) => {
  res.sendFile(__dirname+"/login.html")
  
})

app.get('/register', (req, res) => {
  res.sendFile(__dirname+"/register.html")
  
})

app.get('/register.html', (req, res) => {
  res.sendFile(__dirname+"/register.html")
  
})

app.get('/forgot-password', (req, res) => {
  res.sendFile(__dirname+"/forgot-password.html")
  
})

app.get('/forgot-password.html', (req, res) => {
  res.sendFile(__dirname+"/forgot-password.html")
  
})

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname+"/dashboard.html")
  
})

app.get('/dashboard.html', (req, res) => {
  res.sendFile(__dirname+"/dashboard.html")
  
})

app.get('/income', (req, res) => {
  res.sendFile(__dirname+"/income.html")
  
})

app.get('/income.html', (req, res) => {
  res.sendFile(__dirname+"/income.html")
  
})

app.get('/profile', (req, res) => {
  res.sendFile(__dirname+"/profile.html")
  
})

app.get('/profile.html', (req, res) => {
  res.sendFile(__dirname+"/profile.html")
  
})



var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
databaseURL: 'https://hasalatech-14b00.firebaseio.com'
});
 */


const provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithPopup(provider)

$("#googleLogin").onclick = () => auth.signInWithPopup(provider)
$("#logout").onclick = () => auth.signOut()

auth.onAuthStateChanged(user =>{
  console.log(user.displayName)

  if(user){
//signed in
userDisplayName.innerHTML = "Hello, "+ user.displayName

}

})



console.log("LOOOOOOOOL")




	

 
  
  





//app.listen(port, () => console.log(`Testing on port `+port))