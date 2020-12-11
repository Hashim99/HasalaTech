var regEmail = "";
var fName = ""
var lName = "" 
var regPassword = ""
var loginEmail = ""
var loginPassword = ""


$("#googleLogin").click(function(){


  
 
  auth.signInWithRedirect(provider)


});


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

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    alert(error.message)
  });

});







$("#register").click(function () {
  
regEmail = $("#regEmail").val()


regPassword = $("#regPassword").val()

firebase.auth().createUserWithEmailAndPassword(regEmail, regPassword)

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

  
  }
  
  else{
    $("#userDisplayName").html("Hello, User")
   
  }
  })


