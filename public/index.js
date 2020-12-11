currentBalance = 0
currentSpendings = 0
avgSpendings = 0
var fName = ""
var lName = "" 
var regPassword = ""
let categoryList =[{name:"Food",value:340},{name:"Fuel",value:420},{name:"Shopping",value:490},{name:"Games",value:220}];

const db = firebase.firestore();
var storage = firebase.storage();
var storageRef = storage.ref();


let file = {}

function chooseFile(event) {
    file = event.target.files[0]
}

auth.onAuthStateChanged(user => {

    $( document ).ready(function() {

    if (user) {

        //signed in
        $("#userDisplayName").html("Hello, " + user.displayName)
 
        // "loggedInUser" to deffrentiate between firebase user and our user
        loggedInUser = db.collection("users").doc(user.uid)

        wallet = db.collection("wallets").doc(user.uid + "'s Wallet")
        
        wallet.get().then(function (doc) {
            if (doc.exists) {
                currentBalance = doc.data().balance
                $("#balanceDisplay").html(currentBalance + " SR")
                var count = 0
                for(let i = 0; i < doc.data().spendings.length; i++){
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
                    categories: ["Default"],
                    spendings: []
                }).then(function(){
                    console.log("Wallet created successfully")
                }).catch(function(){
                       
                })
                
                //create a new user
                loggedInUser.set({
                    name: user.displayName,
                    email: user.email,
                    wallets: [wallet.id]
                })

                // doc.data() will be undefined in this case
                $("#balanceDisplay").html(currentBalance + " SR")
                $("#spendingDisplay").html(currentSpendings + " SR")
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        })


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

        //delete the displayed wallet (either name or balance)
        $("#wallet2").click(function (){
            $("#editWalletDelete").click(function (){
                loggedInUser.get().then(function (doc) {
                    let walletId = doc.data().wallets[1]
                    let wallet = db.collection("wallets").doc(walletId)
                    wallet.delete().then(function () {
                        console.log("Wallet deleted")
                    }).catch(function (){
                        console.log("Wallet not deleted")
                    })
                })
                loggedInUser.update({
                    wallets: firebase.firestore.FieldValue.arrayRemove(walletId)
                })
                setTimeout(function () { window.location.reload() }, 3000);
            })
            setTimeout(function () { window.location.reload() }, 3000);
        })

        $("#wallet3").click(function (){
            $("#editWalletDelete").click(function (){
                loggedInUser.get().then(function (doc) {
                    let walletId = doc.data().wallets[2]
                    let wallet = db.collection("wallets").doc(walletId)
                    wallet.delete().then(function () {
                        console.log("Wallet deleted")
                    }).catch(function (){
                        console.log("Wallet not deleted")
                    })
                })
                loggedInUser.update({
                    wallets: firebase.firestore.FieldValue.arrayRemove(walletId)
                })
                setTimeout(function () { window.location.reload() }, 3000);
            })
            setTimeout(function () { window.location.reload() }, 3000);
        })


        //create category
        $("#saveCategory").click(function () {

            let input = $("#categoryInput").val()
            console.log(input)
            wallet.update({
                categories: firebase.firestore.FieldValue.arrayUnion(input)
            })
           
            setTimeout(function () { window.location.reload() }, 300);
        });

        //to update the balance of the wallet
        $("#saveBalance").click(function () {

            currentBalance = parseFloat($("#balanceInput").val()) + currentBalance
            console.log(currentBalance)
            wallet.update({balance: currentBalance})
     
            setTimeout(function () { window.location.reload() }, 300);

        });

        //to track Spendings and its effects on wallet's balance
        $("#saveSpending").click(function () {
            var addedSpendings = parseFloat($("#spendingInput").val())
            var spendingCategory = $("#spendingsCategory").val()
            currentBalance -= addedSpendings
            if(currentBalance < 0){
                currentBalance = 0
            }
            if(spendingCategory !== ""){
                wallet.update({
                    balance: currentBalance,
                    spendings: firebase.firestore.FieldValue.arrayUnion({
                        amount: addedSpendings,
                        date: new Date().toLocaleDateString(),
                        category: spendingCategory
                    })
                })
            } else {
                wallet.update({
                    balance: currentBalance,
                    spendings: firebase.firestore.FieldValue.arrayUnion({
                        amount: addedSpendings,
                        date: new Date().toLocaleDateString(),
                        category: "Default"
                    })
                })
            }
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
            setTimeout(function () { window.location.reload() }, 300);
        })



        //display income

        wallet.get().then(function (doc) {
            //for displaying 2 added income
            let length = doc.data().income.length
            for(let i = 0; i < length; i++){
                switch (i) {
                    case 0:
                        $("#payday1").html(doc.data().income[0].payday)
                        $("#incomeAmount1").html(doc.data().income[0].amount)
                        break;
                    case 1:
                        $("#payday2").html(doc.data().income[1].payday)
                        $("#incomeAmount2").html(doc.data().income[1].amount)
                        break;
                    default:
                        break;
                }
            }
        })


        //display current month
        const month = new Date();
        const monthLabel = month.toLocaleString('default', { month: 'long' })
        $("#month-label").html(monthLabel);
    


        //save profile settings

        $("#saveSettings").click(function () {

         var userName = $("#name").val()
         var userEmail = $("#email").val()

         loggedInUser.update({

            name: userName,
            email: userEmail

        })
        setTimeout(function () { window.location.reload() }, 300);

        });
        
    
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


      
         //save income
         $("#saveIncome").click(function () {
            console.log("e")
         var incomeSource = $("#incomeSourceInput").val()
         var payday = $("#paydayInput").val()
         var incomeAmount = parseFloat($("#incomeAmountInput").val())

         wallet.update({

             income: firebase.firestore.FieldValue.arrayUnion({
                 amount: incomeAmount,
                 payday: payday,
                 source: incomeSource
             })
         })
        console.log("income is updated")

        setTimeout(function () { window.location.reload() }, 300);
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
                    monthSpendings.push(doc.data().spendings[i].amount)
                }
            }
          
                createLineChart(monthSpendings);    
                createPieChart(categoryList);   
             

            console.log(monthSpendings)
        })
        

    }
    
    else {
        $("#userDisplayName").html("Hello, User")
    }
});
})




$("#logout").click(function(){
    auth.signOut()
    window.location.href = "/"
   
});


function createLineChart(spendings) {
        let speaces = [];
        let values = [];

        for (var i = 0; i < spendings.length; i++) {
          speaces.push(" ");
          values.push(spendings[i]);
        }

        var ctx = document.getElementById("lineChart").getContext("2d");
     
        var myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: speaces,
            datasets: [
              {
                label: "Spending",
                data: values,
                backgroundColor: ["rgba(54, 162, 235, 0.2)"],
                borderColor: ["rgba(54, 162, 235, 1)"],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: { position: "right" },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          },
        });
   

      }

      function createPieChart(categories) {
        let labels = [];
        let data = [];


        

        for (var i = 0; i < categories.length; i++) {
          labels.push(categories[i].name);
          data.push(categories[i].value);
        }
     
        var ctx = document.getElementById("pieChart").getContext("2d");
        var myChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: labels,
            datasets: [
              {
                label: "# of Votes",
                data: data,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: { position: "right" },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          },
        });
    
   
      }



   