currentBalance = 0
currentSpendings = 0
avgSpendings = 0
var fName = ""
var lName = "" 
var regPassword = ""






const db = firebase.firestore();
var storage = firebase.storage();
var storageRef = storage.ref();


let file = {}

function chooseFile(event) {
    file = event.target.files[0]
}

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
                for(let i = 0; i < doc.data().spendings.length; i++){
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

                /*
                //create a new user
                loggedInUser.set({
                    name: user.displayName,
                    email: user.email,
                    wallets: [wallet.id]
                })
*/
                // doc.data() will be undefined in this case
                $("#balanceDisplay").html(currentBalance + " SR")
                $("#spendingDisplay").html(currentSpendings + " SR")
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        })

        //----------here hasim------------



        loggedInUser.get().then(function (doc) {
            if (doc.exists) {

                name = doc.data().name
                email = doc.data().email
                avatar = doc.data().profilepic

                $("#userDisplayName").html("Hello, " + name)
                $("#avatar").attr("src", avatar);
                $("#previewPhoto").attr("src", avatar)
                $("#name").val(name)
                $("#email").val(email)

            } else {

                loggedInUser.set({
                    name: user.displayName,
                    email: user.email,
                    wallets: [wallet.id]
                })

                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        })




        //----------stop here hasim------------

        loggedInUser.get().then(function (doc) {
            //for displaying the last 3 added wallets
            let length = doc.data().wallets.length
            let walletId = ""
            let wallet = ""
            for(let i = 0; i < length; i++){
                switch (i) {
                    case 0:
                        walletId = doc.data().wallets[0]
                        wallet = db.collection("wallets").doc(walletId)
                        wallet.get().then(function (doc) {
                            $("#firstWalletName").html(doc.data().name)
                            $("#firstWalletBalance").html(doc.data().balance)
                        })
                        firstWalletId = walletId
                        break;
                    case 1:
                        walletId = doc.data().wallets[1]
                        wallet = db.collection("wallets").doc(walletId)
                        wallet.get().then(function (doc) {
                            $("#secondWalletName").html(doc.data().name)
                            $("#secondWalletBalance").html(doc.data().balance)
                        })
                        secondWalletId=walletId
                        break;
                    case 2:
                        walletId = doc.data().wallets[2]
                        wallet = db.collection("wallets").doc(walletId)
                        wallet.get().then(function (doc) {
                            $("#thirdWalletName").html(doc.data().name)
                            $("#thirdWalletBalance").html(doc.data().balance)
                        })
                        thirdWalletId=walletId
                        break;
                    default:
                        break;
                }
            }
        })

        //edit the displayed wallet (either name or balance)
        


        //delete the displayed wallet (either name or balance)



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
            console.log(firstWalletId);
            console.log(secondWalletId);
            console.log(thirdWalletId);
            setTimeout(function () { window.location.reload() }, 5000);
        })

        //display current month
        const month = new Date();
        const monthLabel = month.toLocaleString('default', { month: 'long' })
        $("#month-label").html(monthLabel);
    
    
        //change profile pic
        $("#changePhoto").click(function () {

            console.log(file)
            var uploadAvatar = storageRef.child(user.uid + "'s profile pic").put(file)

            storageRef.child(user.uid + "'s profile pic").getDownloadURL().then(imgUrl => {

                $("#previewPhoto").attr("src", imgUrl)
                console.log(imgUrl)
                loggedInUser.update({

                    profilepic: imgUrl

                })
            })
        });

        //query for all spendings within a month
        var monthSpendings = []
        wallet.get().then(function (doc) {
            let length = doc.data().spendings.length
            console.log("the length is" + length)
            let month = new Date().getMonth() + 1
            console.log("current month is" + month)
            for (let i = 0; i < length; i++){
                let dateS = doc.data().spendings[i].date
                console.log("spending date "+ i + " is " +dateS)
                let monthS = dateS.split('/')
                console.log("spending month "+ i + " is " +monthS[0])
                if(monthS[0] == month){
                    monthSpendings.push({
                        amount: doc.data().spendings[i].amount,
                        date: doc.data().spendings[i].date
                    })
                }
            }
            console.log(monthSpendings)
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
