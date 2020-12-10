currentBalance = 0
currentSpendings = 0
avgSpendings = 0
var fName = ""
var lName = "" 
var regPassword = ""

const db = firebase.firestore();



auth.onAuthStateChanged(user => {


    if (user) {
        //signed in
        $("#userDisplayName").html("Hello, " + user.displayName)

        // "loggedInUser" to deffrentiate between firebase user and our user
        loggedInUser = db.collection("users").doc(user.uid)
        

        wallet = db.collection("wallets").doc(user.uid + "'s Wallet")
        console.log(wallet)
        wallet.get().then(function (doc) {
            if (doc.exists) {
                currentBalance = doc.data().balance
                $("#balanceDisplay").html(currentBalance + " SR")
                var count = 0
                for(i = 0; i < doc.data().spendings.length; i++){
                    currentSpendings += doc.data().spendings[i].amount
                    count++
                }
                $("#spendingDisplay").html(currentSpendings + " SR")
                count = parseFloat(count)
                console.log(count)
                if(count != 0){
                    avgSpendings = currentSpendings/count
                    console.log(avgSpendings)
                    $("#spendingAvgDisplay").html(avgSpendings + " SR")
                } else {
                    $("#spendingAvgDisplay").html(0 + " SR")
                }
                

            } else {
                db.collection("wallets").doc(user.uid + "'s Wallet").set({
                    name: "Main Wallet",
                    balance: 0,
                    users: [
                        user.uid + ""
                    ],
                    bills: [],
                    income: [],
                    categories: [],
                    spendings: []
                }).then(function(){
                    console.log("Wallet created successfully")
                }).catch(function(){
                    console.log("Uh Oh, we made a fucky wucky")
                })
                // doc.data() will be undefined in this case
                $("#balanceDisplay").html(currentBalance + " SR")
                $("#spendingDisplay").html(currentSpendings + " SR")
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        })

        loggedInUser.set({
            email: user.email,
            name: user.displayName,
            profilepic: "www.google.com",
            wallets: [wallet.id]
        })



        $("#saveBalance").click(function () {

            currentBalance = parseFloat($("#balanceInput").val()) + currentBalance
            console.log(currentBalance)
            wallet.update({balance: currentBalance})
            // i have to do stupid shit like this because we couldn't use react :\
            setTimeout(function () { window.location.reload() }, 300);

        });

        //to track Spendings and its effects on wallet's balance
        $("#saveSpending").click(function () {
            var addedSpendings = parseFloat($("#spendingInput").val())
            currentBalance -= addedSpendings
            if(currentBalance < 0){
                currentBalance = 0
            }
            wallet.update({
                balance: currentBalance,
                spendings: firebase.firestore.FieldValue.arrayUnion({
                    amount: addedSpendings,
                    date: new Date().toLocaleDateString()
                })
            })
            console.log("spendings are updated")
            setTimeout(function () { window.location.reload() }, 300);
        })
    }


    else {
        $("#userDisplayName").html("Hello, User")
        console.log("out")
    }
})

$("#logout").click(function(){
 
    console.log("bruh")
    auth.signOut()
    window.location.href = "/"
   
});
