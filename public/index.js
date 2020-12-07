const auth = firebase.auth()

const provider = new firebase.auth.GoogleAuthProvider();
var currentBalance = 0;
$("#logout").click(function () {

    console.log("bruh")
    auth.signOut()
    window.location.href = "/"

});

const db = firebase.firestore();

auth.onAuthStateChanged(user => {


    if (user) {
        //signed in
        $("#userDisplayName").html("Hello, " + user.displayName)

        wallet = db.collection("wallets").doc(user.uid + "'s Wallet")

        wallet.get().then(function (doc) {
            if (doc.exists) {
                currentBalance = doc.data().balance
                $("#balanceDisplay").html(doc.data().balance + " SAR")


            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        })



        $("#saveBalance").click(function () {

            currentBalance = parseInt($("#balanceInput").val(), 10) + currentBalance
            console.log(currentBalance)
            wallet.set({

                balance: currentBalance,
                name: "User's Wallet",
                users: [user.uid]
            })
            // i have to do stupid shit like this because we couldn't use react :\
            setTimeout(function () { window.location.reload() }, 300);

        });


    }

    else {
        $("#userDisplayName").html("Hello, User")
        console.log("out")
    }
})



