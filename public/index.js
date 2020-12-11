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
                    console.log(doc.data().spendings[i].amount);
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

                //create a new user
                loggedInUser.set({
                    email: user.email,
                    name: user.displayName,
                    profilepic: "www.google.com",
                    wallets: [wallet.id]
                })

                // doc.data() will be undefined in this case
                $("#balanceDisplay").html(currentBalance + " SR")
                $("#spendingDisplay").html(currentSpendings + " SR")
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        })

        //an infinite loop is happening and slowing the website, we have to find a solution. (?)

        loggedInUser.get().then(function (doc) {
            //for displaying the last 3 added wallets
            let length = doc.data().wallets.length
            let walletId = ""
            let wallet = ""
            for(i = 0; i < length; i++){
                switch (i) {
                    case 0:
                        walletId = doc.data().wallets[0]
                        wallet = db.collection("wallets").doc(walletId)
                        wallet.get().then(function (doc) {
                            $("#firstWalletName").html(doc.data().name)
                            $("#firstWalletBalance").html(doc.data().balance)
                        })
                        break;
                    case 1:
                        walletId = doc.data().wallets[1]
                        wallet = db.collection("wallets").doc(walletId)
                        wallet.get().then(function (doc) {
                            $("#secondWalletName").html(doc.data().name)
                            $("#secondWalletBalance").html(doc.data().balance)
                        })
                        break;
                    case 2:
                        walletId = doc.data().wallets[2]
                        wallet = db.collection("wallets").doc(walletId)
                        wallet.get().then(function (doc) {
                            $("#thirdWalletName").html(doc.data().name)
                            $("#thirdWalletBalance").html(doc.data().balance)
                        })
                        break;
                    default:
                        break;
                }
            }
        })

        //to update the balance of the wallet
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

        //to add a new wallet to the list
        $("#addWalletSave").click(function () {
            var walletName = $("#addWalletName").val()
            var walletBalance = parseFloat($("#addWalletAmount").val())
            if (walletBalance < 0) {
                walletBalance = 0
            }
            //create generated id and save it to a variable
            //use the created id to make a new wallet document
            db.collection("wallets").add({
                name: walletName,
                balance: walletBalance,
                users: [
                    user.uid + ""
                ],
                bills: [],
                income: [],
                categories: [],
                spendings: []
            }).then(function (doc) {
                loggedInUser.update({
                    wallets: firebase.firestore.FieldValue.arrayUnion(doc.id + "")
                })
            })
            //then use that wallet id and update the wallets array
            
            setTimeout(function () { window.location.reload() }, 5000);
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
