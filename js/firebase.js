//------------ FireBase----------------------

const tableUsers = document.querySelector('.table-users');
var arrayAllReports =[];

const firebaseConfig = {
    apiKey: "AIzaSyCNfJbkMiwe0bt-uJIugRDsBK9NUsb79Gg",
    authDomain: "dbtest-ab425.firebaseapp.com",
    projectId: "dbtest-ab425",
    storageBucket: "dbtest-ab425.appspot.com",
    messagingSenderId: "166629080487",
    appId: "1:166629080487:web:61b7db5d29a2cb94090a82",
    measurementId: "G-7FVTTDGWEL",
    databaseURL: "https://dbtest-ab425-default-rtdb.firebaseio.com"
};


// {
//     "rules": {
//       ".read": "auth!=null",
//       ".write": true
//     }
//   }

// const firebaseConfig = {
//   apiKey: "AIzaSyCMn7SgkQj5ZHw3MdCwLJr4gCDS7yzbrP8",
//   authDomain: "healthygumzrisktest.firebaseapp.com",
//   databaseURL: "https://healthygumzrisktest-default-rtdb.firebaseio.com",
//   projectId: "healthygumzrisktest",
//   storageBucket: "healthygumzrisktest.appspot.com",
//   messagingSenderId: "336290999628",
//   appId: "1:336290999628:web:67bcfa41cadbe6326673e9",
//   measurementId: "G-70BZYJ7SXE",
//   databaseURL: " https://healthygumzrisktest-default-rtdb.firebaseio.com"
// };

//---------  Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.database();
const dbRef = db.ref('Reports');
const currentDate = new Date().toLocaleDateString();


//----------  Login and Registration
function newRegistration() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector('#password').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
}

function loginExistingUsers() {

    // var loginContainer = document.querySelector('.login-modal');
    // var mainContainer = document.querySelector('.container');
    // loginContainer.classList.remove('modal-show');
    // mainContainer.classList.add('modal-show');
    // getDataFromDB()

    const email = document.querySelector("#email").value;
    const password = document.querySelector('#password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            var loginContainer = document.querySelector('.login-modal');
            var mainContainer = document.querySelector('.report-container');
            loginContainer.classList.remove('modal-show');
            mainContainer.classList.add('modal-show');
            getDataFromDB()
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
}

//--------- FireBase

function getDataFromDB() {
    dbRef.get().then((snapshot) => {
        if (snapshot.exists()) {
            updateReportTable(snapshot.val())
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

function updateReportTable(allReportsFromDB) {
    const arrayIdName = [];

    for (var name in allReportsFromDB) {
        arrayIdName.push(name);
    }

    for (i = 0; i < arrayIdName.length; i++) {
        var objJson = allReportsFromDB[arrayIdName[i]];
        objJson.id = arrayIdName[i];
        arrayAllReports.push(objJson);
    }

    arrayAllReports.forEach(report => {
        renderUser(report);
    })
}


// Create element and render users
const renderUser = doc => {
    const tr = `
      <tr data-id='${doc.id}'>
        <td>${doc.date}</td>
        <td>${doc.userData.name}</td>
        <td>${doc.userData.email}</td>
        <td>${doc.userData.code}</td>
        <td>
          <button class="btn btn-download">Download</button>
          <button class="btn btn-delete">Delete</button>
        </td>
      </tr>
    `;
    tableUsers.insertAdjacentHTML('beforeend', tr);

    const btnDelete = document.querySelector(`[data-id='${doc.id}'] .btn-delete`);
    btnDelete.addEventListener('click', () => {
        dbRef.child(doc.id).remove().
            then(() => {
                let tr = document.querySelector(`[data-id='${doc.id}']`);
                let tbody = tr.parentElement;
                tableUsers.removeChild(tbody);
            }).catch((error) => {
                console.log(error);
            })
    });

    const btnDownload = document.querySelector(`[data-id='${doc.id}'] .btn-download`);
    btnDownload.addEventListener('click', () => {
        convertToCsv(arrayAllReports.find(report=>{return report.id=doc.id}));
    });
}



function convertToCsv(report) {

    // for (i = 0; i < arrayOfJson.length; i++) {


    //     var csvStr = 'Date' + ';' + arrayOfJson[i].date + "\n";
    //     csvStr += 'Name' + ';' + arrayOfJson[i].userData.name + "\n";
    //     csvStr += 'E-mail' + ';' + arrayOfJson[i].userData.email + "\n";
    //     csvStr += 'Zip code' + ';' + arrayOfJson[i].userData.code + "\n";
    //     csvStr += ' ' + ';' + ' ' + "\n";

    //     arrayOfJson[i].testReport.forEach(element => {
    //         question = element[0];
    //         answer = element[1];

    //         csvStr += question + ';' + answer + "\n";
    //     })

    //     fileName = arrayOfJson[i].userData.email + '.csv';
    //     downloadCSV(fileName, csvStr);

    // }


    var csvStr = 'Date' + ';' + report.date + "\n";
    csvStr += 'Name' + ';' + report.userData.name + "\n";
    csvStr += 'E-mail' + ';' + report.userData.email + "\n";
    csvStr += 'Zip code' + ';' + report.userData.code + "\n";
    csvStr += ' ' + ';' + ' ' + "\n";

    report.testReport.forEach(element => {
        question = element[0];
        answer = element[1];

        csvStr += question + ';' + answer + "\n";
    })

    fileName = report.userData.email + '.csv';
    downloadCSV(fileName, csvStr);




}

function downloadCSV(fileName, csvStr) {

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvStr);
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName;
    hiddenElement.click();
}




// function addDataToDB(mail, name, zipCode, bodyQuestions) {
//     const autoId = dbRef.push().key;
//     dbRef.child(autoId).set({
//         date: currentDate,
//         userData: { name: name, email: mail, code: zipCode },
//         testReport: bodyQuestions
//     }).then(() => {
//     }).catch((error) => {
//         console.log(error);
//     })
// }
