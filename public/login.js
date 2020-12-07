const auth = firebase.auth() 

const provider = new firebase.auth.GoogleAuthProvider();

$("#googleLogin").click(function(){
  console.log("ffkjf")
  
  $("#loginBody").hide()
  auth.signInWithRedirect(provider)


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