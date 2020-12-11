currentBalance = 0
currentSpendings = 0
avgSpendings = 0
var fName = ""
var lName = "" 
var regPassword = ""
var walletId = ""
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

                //an infinite loop is happening and slowing the website, we have to find a solution. (?)

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


        // loggedInUser.get().then(function (doc) {
        //     //for displaying the last 3 added wallets
        //     for(i = doc.data().wallets.length; i > 0; i++){
        //         switch (i) {
        //             case (doc.data().wallets.length - 1):
        //                 $("#firstWalletName").html(doc.data().wallets[i].name)
        //                 $("#firstWalletBalance").html(doc.data().wallets[i].balance)
        //                 break;
        //             case (doc.data().wallets.length - 2):
        //                 $("#secondWalletName").html(doc.data().wallets[i].name)
        //                 $("#secondWalletBalance").html(doc.data().wallets[i].balance)
        //             break;
        //             case (doc.data().wallets.length - 3):
        //                 $("#secondWalletName").html(doc.data().wallets[i].name)
        //                 $("#secondWalletBalance").html(doc.data().wallets[i].balance)
        //             break;
        //             default:
        //                 break;
        //         }
        //     }
        // })

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
                walletId = doc.id
                console.log(walletId)
            })
            //then use that wallet id and update the wallets array
            loggedInUser.update({
                wallets: firebase.firestore.FieldValue.arrayUnion(walletId + "")
            })
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
