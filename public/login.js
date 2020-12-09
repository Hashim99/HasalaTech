var regEmail = "";
var fName = ""
var lName = "" 
var regPassword = ""
var loginEmail = ""
var loginPassword = ""


$("#googleLogin").click(function(){

  console.log("clicked")
  
 
  auth.signInWithRedirect(provider)


});

// اضحك عليه يا عمي نفس الشي
$("#googleReg").click(function(){
  
  
  
  auth.signInWithRedirect(provider)


});

$("#login").click(function(){
 
  
  

  loginEmail = $("#loginEmail").val()
  loginPassword = $("#loginPassword").val()
 
  firebase.auth().signInWithEmailAndPassword(loginEmail, loginPassword)

  .then((user) => {
    // Signed in 
    // ...
    console.log("s")
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(error.message)
  });

});







$("#register").click(function () {
  
regEmail = $("#regEmail").val()

console.log(regEmail)
regPassword = $("#regPassword").val()
console.log(regPassword)
firebase.auth().createUserWithEmailAndPassword(regEmail, regPassword)
console.log(69420)
.then((user) => {
  // Signed in 
  // ...
})
.catch((error) => {
  var errorCode = error.code;
  var errorMessage = error.message;
alert(error.message)
});

});

auth.onAuthStateChanged(user =>{
 
    if(user){
  //signed in
  window.location = "dashboard.html"
 
  $("#userDisplayName").html("Hello, "+user.displayName)
  console.log(user.displayName)
  
  }
  
  else{
    $("#userDisplayName").html("Hello, User")
    console.log("out")
  }
  })