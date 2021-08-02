var currentTab = 0;
let arrStepHeaders = ['About Me', 'Lifestyle', 'Dental Health', 'Warning Signs I', 'Warning Signs II', 'Health History'];
var width=0;


function init() {

  width=document.body.clientWidth; 

  if (width>767){
    $('#curved').elipText({ radius: 265 });
  }
  else{
    $('#curved').elipText({ radius: 160 });
  }

  var radios = document.querySelectorAll('[id^="radiobutton"]')
  radios.forEach(element => {
    element.addEventListener("click", checkBoxClick, false);
  });

  var x = document.getElementsByClassName("form-step");

  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }

 
}

function checkBoxClick() {

  circles = document.querySelectorAll('div[name="' + this.name + '"]');
  circles.forEach(element => {
    element.classList.add("radio-circle");
    element.classList.remove("error-circle");
  });

}


function showTab(n) {
  var x = document.getElementsByClassName("form-step");
  $("#form_step-" + parseInt(n + 1)).fadeIn(800);
  x[n].style.display = "flex";

  if (n == 0) {
    document.getElementById("prevBtn").style.visibility = "hidden";
  } else {
    document.getElementById("prevBtn").style.visibility = "visible";
  }


  if (n == 5) {
    document.getElementById("nextBtn").innerHTML = "Finish";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }

  document.getElementById("stepHeaders").innerHTML = arrStepHeaders[n];

  document.getElementById("stepIndex").innerHTML = "Step " + (n + 1) + " /6";

  var target = document.getElementById ('mainCaption');
  $('html, body').animate({scrollTop: $(target).offset().top-180}, 10);

  fixStepIndicator(n)
}

function tryAgain() {
  var x = document.getElementsByClassName("form-step");

  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }


  var radios = document.querySelectorAll('[id^="radiobutton"]')
  for (var i = 0; i < radios.length; i++) {
    radios[i].checked = false;
  }

  document.getElementById("stepActionsResult").style.display = "none";
  document.getElementById("stepActions").style.display = "flex";

  currentTab = 0;

  document.getElementById("mainCaption").innerHTML = 'TAKE THE RISK TEST';

  showTab(currentTab);

}


function nextPrev(n) {

  var isValid = true;

  var x = document.getElementsByClassName("form-step");

  if (n == 1) {
    isValid = validateForm(currentTab);
  }

  if (isValid) {

    x[currentTab].style.display = "none";

    currentTab = currentTab + n;

    if (n == - 1) {
      document.getElementById("nextBtn").innerHTML = "Next";
    }

    if (document.getElementById("nextBtn").innerHTML == "Finish") {
      checkResult();
    }
    else {
      showTab(currentTab);
    }
  }
}

function navClick(currentNav) {
  // var x = document.getElementsByClassName("form-step");

  // for (i = 0; i < x.length; i++) {
  //   x[currentTab].style.display = "none";
  // }

  // if (currentNav == 1) {
  //   currentTab = 0;
  //   showTab(currentTab);
  // }
  // else {
  //   document.getElementById("nextBtn").innerHTML = "Next";
  //   currentTab = currentNav - 2;
  //   nextPrev(1);
  // }
}



function isDiabetesCheck(isCheck) {

  if (isCheck == 1) {
    $("#stepIsDiabetes").slideDown(500);
  }
  else {
    $("#radiobutton32").prop("checked", false);
    $("#radiobutton33").prop("checked", false);
    $("#stepIsDiabetes").slideUp(500);
  }
}



function checkResult() {

  var radios = document.querySelectorAll('[id^="radiobutton"]')
  var result = 0;
  var resultlDescription = "";

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      result += parseInt(radios[i].value);
    }
  }

  document.getElementById("mainCaption").innerHTML = 'YOUR RESULT';

  var i, x = document.getElementsByClassName("form-step");

  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }

  var resultStep = document.getElementById("form_step-result");
  resultStep.className += " active";
  resultStep.style.display = "block";


  if (width>767){
    document.getElementById("stepActionsResult").style.display = "block";
  }
  else{
    document.getElementById("stepActionsResult").style.display = "flex";
  }

    document.getElementById("stepActions").style.display = "none";

  var nav = document.getElementsByClassName("nav-step")
  nav[nav.length - 1].className = nav[nav.length - 1].className += " current";

  // for (i = 0; i < nav.length; i++) {
  //   nav[i].className += " disabled";
  // }

  document.getElementById("stepIndex").innerHTML = "Step 6/6";
  document.getElementById("stepHeaders").innerHTML="Result";


  if (result <= 3) {
    result = 5;
    resultlDescription = 'Great News! Your score suggests that you are at low risk of having gum disease.  By maintaining a low score, you can reduce the likelihood of developing other  related medical conditions. To learn more, click on one of the buttons below:';
  }
  else if (result > 3 && result <= 8) {
    result = 15;
    resultlDescription = 'Your score suggests that you are at moderate risk of having gum disease. Patients with gum disease are more likely to develop related chronic medical conditions. Your score indicates the chance that your gum health will get worse without professional care. To take the first step towards having better oral and overall health, click on the links below:';
  }
  else {
    result = 25;
    resultlDescription = 'Your score suggests that you are at high risk of having gum disease. Patients with gum disease are more likely to develop related chronic medical conditions.  Your score implies that your gum health will get worse without professional care. To take action towards having better oral and overall health, click on the links below:';
  };


  initQauge(result);

  document.getElementById("textResult").innerHTML = resultlDescription;
}


function initQauge(result) {
  demoGauge = new Gauge(document.getElementById("step-result"));
  var opts = {
    angle: 0.098,
    lineWidth: 0.42,
    radiusScale: 1,
    pointer: {
      length: 0.6,
      strokeWidth: 0.05,
      color: '#000000'
    },

    staticZones: [
      { strokeStyle: "#FFDD00", min: 0, max: 10 },
      { strokeStyle: "#F99D0C", min: 10, max: 20 },
      { strokeStyle: "#F35C19", min: 20, max: 30 }
    ],
    limitMax: false,
    limitMin: false,
    highDpiSupport: true
  };
  demoGauge.setOptions(opts);
  demoGauge.minValue = 0;
  demoGauge.maxValue = 30;
  demoGauge.set(result);
};






function validateForm(currentTab) {

  var checkboxes;
  var i;
  var radioGroupIndex;
  var pagaCheckboxArray = [3, 6, 7, 10, 13, 16]; //index of checkboxs on per page
  var isValidate = true;
  var currentIndex;
  var circles;
  var isDiabetesCheck = false;

  if (currentTab == 0) {
    currentIndex = 1;
  }
  else {
    currentIndex = pagaCheckboxArray[currentTab - 1] + 1;
  }

  if (currentTab == 5) {
    var diabetesEl = document.getElementById("radiobutton31"); // IsDiabetes cheсked

    if (diabetesEl.checked) {
      isDiabetesCheck = true;
    }
  }

  for (i = currentIndex; i <= pagaCheckboxArray[currentTab]; i++) {
    radioGroupIndex = 'radio-group' + i;
    checkboxes = document.querySelectorAll('input[name="' + radioGroupIndex + '"]:checked');
    if (i == 15 && isDiabetesCheck) {

    }
    else {
      if (checkboxes.length == 0 && !isDiabetesCheck) {
        circles = document.querySelectorAll('div[name="' + radioGroupIndex + '"]');
        circles.forEach(element => {
          element.classList.remove("radio-circle");
          element.classList.add("error-circle");
        });
        isValidate = false;
      }

    }
  }
  return isValidate;
}


function fixStepIndicator(n) {

  var i, x = document.getElementsByClassName("form-step");
  var nav = document.getElementsByClassName("nav-step")

  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  x[n].className += " active";

  for (i = 0; i < nav.length; i++) {
    nav[i].className = nav[i].className.replace(" current", "");
  }

  for (i = 0; i <= n; i++) {
    nav[i].className = nav[i].className += " current";
  }

}