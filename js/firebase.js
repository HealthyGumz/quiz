//------------ FireBase----------------------

const tableUsers = document.querySelector('.table-users');
var arrayAllReports = [];
var arrayIdName = [];

const firebaseConfig = {
    apiKey: "AIzaSyCMn7SgkQj5ZHw3MdCwLJr4gCDS7yzbrP8",
    authDomain: "healthygumzrisktest.firebaseapp.com",
    databaseURL: "https://healthygumzrisktest-default-rtdb.firebaseio.com",
    projectId: "healthygumzrisktest",
    storageBucket: "healthygumzrisktest.appspot.com",
    messagingSenderId: "336290999628",
    appId: "1:336290999628:web:67bcfa41cadbe6326673e9",
    measurementId: "G-70BZYJ7SXE",
    databaseURL: " https://healthygumzrisktest-default-rtdb.firebaseio.com"
};

//---------  Initialize Firebase ----------------------
const app = firebase.initializeApp(firebaseConfig);
const db = app.database();
const dbRef = db.ref('Reports');
const currentDate = new Date().toLocaleDateString();


//----------  Login -------------------------------

document.querySelector("#email").value = getCookie('email');
document.querySelector("#password").value=getCookie('password');

function loginExistingUsers() {

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            setCookie('email', email, '30')
            setCookie('password', password, '30')
            var loginContainer = document.querySelector('.login-modal');
            var mainContainer = document.querySelector('.report-container');
            loginContainer.classList.remove('modal-show');
            mainContainer.classList.add('modal-show');
            getDataFromDB()
        })
        .catch((error) => {
            document.getElementById("dlgLoginInvalid").style.display = "block";
        });
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



//--------------------------- FireBase -------------------------------------

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
      <td> <input type="checkbox" class="checkbox" /></td>
      <td>${doc.date}</td>
        <td>${doc.userData.name}</td>
        <td>${doc.userData.email}</td>
        <td>${doc.userData.code}</td>
      </tr>
    `;
    tableUsers.insertAdjacentHTML('beforeend', tr);
}

const btnDelete = document.querySelector('#btnDelete');
btnDelete.addEventListener('click', () => {
    document.getElementById("dlgDelete").style.display = "block";
});

const btnConfirm = document.querySelector('#btnConfirm');
btnConfirm.addEventListener('click', () => {
    var btnCheckBox;
    var idName;

    for (i = 0; i < arrayIdName.length; i++) {
        btnCheckBox = document.querySelector(`[data-id='${arrayIdName[i]}'] .checkbox`);
        if (btnCheckBox !== null && btnCheckBox.checked) {
            idName = arrayIdName[i];
            let tr = document.querySelector(`[data-id='${arrayIdName[i]}']`);
            let tbody = tr.parentElement;
            tableUsers.removeChild(tbody);
            delete arrayIdName[i];
            dbRef.child(idName).remove().
                then(() => {
                }).catch((error) => {
                    console.log(error);
                })
        }

    }
    document.getElementById("dlgDelete").style.display = "none";
});



const btnLoginClose = document.querySelector('#btnLoginClose');
btnLoginClose.addEventListener('click', () => {
    document.getElementById("dlgLoginInvalid").style.display = "none";

});

const btnDeleteClose = document.querySelector('#btnDeleteClose');
btnDeleteClose.addEventListener('click', () => {
    document.getElementById("dlgDelete").style.display = "none";

});


const btnSelectClose = document.querySelector('#btnSelectClose');
btnSelectClose.addEventListener('click', () => {
    document.getElementById("dlgSelectItem").style.display = "none";

});

const btnDownload = document.querySelector('#btnDownload');
btnDownload.addEventListener('click', () => {
    var btnCheckBox;
    var idName;
    var csvStr;
    var report;
    var isOneSelected = false;

    for (i = 0; i < arrayIdName.length; i++) {
        btnCheckBox = document.querySelector(`[data-id='${arrayIdName[i]}'] .checkbox`);
        if (btnCheckBox !== null && btnCheckBox.checked) {
            idName = arrayIdName[i];
            isOneSelected = true;
            report = arrayAllReports.find(rep => { return rep.id === idName })

            csvStr += 'Date' + ';' + report.date + "\n";
            csvStr += 'Name' + ';' + report.userData.name + "\n";
            csvStr += 'E-mail' + ';' + report.userData.email + "\n";
            csvStr += 'Zip code' + ';' + report.userData.code + "\n";
            csvStr += ' ' + ';' + ' ' + "\n";

            report.testReport.forEach(element => {
                question = element[0];
                answer = element[1];

                csvStr += question + ';' + answer + "\n";
            })

            csvStr += ' ' + ';' + ' ' + "\n";
            csvStr += ' ' + ';' + ' ' + "\n";
        }

    }

    if (isOneSelected) {
        fileName = 'Reports.csv';
        downloadCSV(fileName, csvStr);
    }
    else
        document.getElementById("dlgSelectItem").style.display = "block";
});

document.querySelector('#checkBoxAll').addEventListener('click', () => {
    var chkboxState;
    var btnCheckBox;

    if (document.querySelector('#checkBoxAll').checked)
        chkboxState = true;
    else
        chkboxState = false;

    for (i = 0; i < arrayIdName.length; i++) {
        btnCheckBox = document.querySelector(`[data-id='${arrayIdName[i]}'] .checkbox`);
        if (btnCheckBox !== null)
            btnCheckBox.checked = chkboxState;

    }
});


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
