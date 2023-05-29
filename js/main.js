var currentTab = 0;
let arrStepHeaders = ['About Me', 'Lifestyle', 'Dental Health', 'Warning Signs I', 'Warning Signs II', 'Health History'];
var widthDoc = 0;
var testResult = 0;
let arrPdfQuestions = ['ARE YOU 40 YEARS OF AGE OR OLDER?', 'ARE YOU PREGNANT?', 'DOES GUM DISEASE RUN IN YOUR FAMILY?', 'HOW OFTEN DO YOU BRUSH?', 'HOW OFTEN DO YOU FLOSS?',
  'DO YOU SMOKE, VAPE, OR USE ANY TYPE OF TOBACCO PRODUCTS?', 'HOW OFTEN DO YOU SEE YOUR DENTIST FOR CHECKUPS?', 'DO YOUR GUMS BLEED WHEN YOU BRUSH OR FLOSS?',
  'ARE YOUR GUMS SWOLLEN OR TENDER?', 'DO ANY OF YOUR TEETH FEEL LOOSE?', 'DO YOU HAVE ANY AREAS OF GUM RECESSION (I.E. EXPOSED ROOTS, BLACK TRIANGLES BETWEEN TEETH, OR GUMS PULLING BACK)?',
  'DO YOU HAVE FREQUENT BAD BREATH?', 'HAVE YOU HAD TEETH REMOVED IN THE PAST, DUE TO GUM DISEASE?', 'DO YOU HAVE DIABETES?', 'ARE YOUR BLOOD GLUCOSE LEVELS WELL-CONTROLLED?',
  'HAVE YOU BEEN DIAGNOSED WITH HEART DISEASE (INCLUDING HIGH BLOOD PRESSURE, STROKE, HEART ATTACK) OR OSTEOPOROSIS?'];
var bodyQuestions = [];

var pdfBase64 = '';
var pdfLineHeight=270;
var pdfImagePath='';

function init() {

  widthDoc = document.body.clientWidth;

  var radios = document.querySelectorAll('[id^="radiobutton"]')
  radios.forEach(element => {
    element.addEventListener("click", checkBoxClick, false);
  });

  $('.disclaimer').click(function () {
    $('.down-arrow').toggleClass('invert');
    $('.disclaimer-text').slideToggle(300);
  });


  $('.disclaimer-finish').click(function () {
    $('.down-arrow-finish').toggleClass('invert');
    $('.disclaimer-text-finish').slideToggle(500);
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
  n =5;
  currentTab = 5;

  var x = document.getElementsByClassName("form-step");
  $("#form_step-" + parseInt(n + 1)).fadeIn(800);
  x[n].style.display = "flex";

  if (n == 5) {
    document.getElementById("stepActionsFinish").style.visibility = "visible";
    document.getElementById("stepActions").style.visibility = "hidden";
  }
  else {
    document.getElementById("stepActionsFinish").style.visibility = "hidden";
    document.getElementById("stepActions").style.visibility = "visible";
  }

  if (n == 0 || n == 5) {
    document.getElementById("prevBtn").style.visibility = "hidden";
  }
  else {
    document.getElementById("prevBtn").style.visibility = "visible";
  }


  document.getElementById("stepHeaders").innerHTML = arrStepHeaders[n];

  document.getElementById("stepIndex").innerHTML = "Step " + (n + 1) + " /6";

  var target = document.getElementById('mainCaption');
  $('html, body').animate({ scrollTop: $(target).offset().top - 180 }, 10);

  fixStepIndicator(n)
}

function tryAgain() {
  var x = document.getElementsByClassName("form-step");

  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }

  document.getElementById("sendByMainBtn").disabled = false; 

  var radios = document.querySelectorAll('[id^="radiobutton"]')
  for (var i = 0; i < radios.length; i++) {
    radios[i].checked = false;
  }

  document.getElementById("stepActionsResult").style.display = "none";
  document.getElementById("stepActions").style.display = "flex";

  document.getElementById("sendMailSuccess").style.display = "none";
  document.getElementById("sendMailUnsuccess").style.display = "none";
  document.getElementById("sendMail").style.display = "block";

  document.getElementById("inputName").value = "";
  document.getElementById("inputMail").value = "";
  document.getElementById("inpuZipCode").value = "";

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

    if (currentTab == 6) {
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
  var questionIndex=0;
  var pdfAnswars="";

  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      result += parseInt(radios[i].value);

      pdfAnswars=$("label[for='" + radios[i].id + "']").text();
      bodyQuestions.push([arrPdfQuestions[questionIndex], pdfAnswars]);
      questionIndex++;

      if (radios[i].id=="radiobutton31" ){
        pdfLineHeight=260;
        questionIndex++;
       }
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


  if (widthDoc > 940) {
    document.getElementById("stepActionsResult").style.display = "flex";
  }
  else {
    document.getElementById("stepActionsResultMob").style.display = "block";
  }

  document.getElementById("stepActions").style.display = "none";

  var nav = document.getElementsByClassName("nav-step")
  nav[nav.length - 1].className = nav[nav.length - 1].className += " current";

  document.getElementById("stepIndex").innerHTML = "Step 6/6";
  document.getElementById("stepHeaders").innerHTML = "Result";


  if (result <= 3) {
    result = 5;
    resultlDescription = 'Great News! Your score suggests that you may be at low risk of having gum disease. By maintaining a low score, you can reduce the likelihood of developing other  related medical conditions.';
    pdfImagePath="https://healthygumz.github.io/quiz/images/client_pdf/low_risk.png";
    document.getElementById("gauge").setAttribute('data-src', 'https://healthygumz.github.io/quiz/documents/LowRisk.json');
  }
  else if (result > 3 && result <= 8) {
    result = 15;
    resultlDescription = 'Your score suggests that you may be at moderate risk of having gum disease. Patients with gum disease are more likely to develop related chronic medical conditions. Your score indicates the chance that your gum health will get worse without professional care.';
    pdfImagePath="https://healthygumz.github.io/quiz/images/client_pdf/moderate_risk.png"
    document.getElementById("gauge").setAttribute('data-src', 'https://healthygumz.github.io/quiz/documents/ModerateRisk.json');
  }
  else {
    result = 25;
    resultlDescription = 'Your score suggests that you may be at high risk of having gum disease. Patients with gum disease are more likely to develop related chronic medical conditions.  Your score implies that your gum health will get worse without professional care.';
    pdfImagePath="https://healthygumz.github.io/quiz/images/client_pdf/high_risk.png";
    document.getElementById("gauge").setAttribute('data-src', 'https://healthygumz.github.io/quiz/documents/HighRisk.json');
  };

  element = document.createElement("script");
  // element.src = "js/gaugewebflow.js";
  element.src = "https://uploads-ssl.webflow.com/601313a4281bc325b125c398/js/webflow.c0841dd9f.js";
  document.body.appendChild(element);


  testResult = result;
  document.getElementById("textResult").innerHTML = resultlDescription;
  window.scrollTo( 0, 0 );
}



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
      if (checkboxes.length == 0) {
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

  var x = document.getElementsByClassName("form-step");
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


function validateMail() {

  var isValidate = true;

  var name = document.getElementById("inputName");
  var mail = document.getElementById("inputMail");
  var zipCode = document.getElementById("inpuZipCode");

  if (name.value == "") {
    isValidate = false;
    name.classList.remove("circle-mail");
    name.classList.add("error-circle-mail");
  }
  else {
    name.classList.remove("error-circle-mail");
    name.classList.add("circle-mail");
  }

  if (mail.value == "") {
    isValidate = false;
    mail.classList.remove("circle-mail");
    mail.classList.add("error-circle-mail");
  }
  else {
    mail.classList.remove("error-circle-mail");
    mail.classList.add("circle-mail");
  }

  if (zipCode.value == "") {
    isValidate = false;
    zipCode.classList.remove("circle-mail");
    zipCode.classList.add("error-circle-mail");
  }
  else {
    zipCode.classList.remove("error-circle-mail");
    zipCode.classList.add("circle-mail");
  }

  return isValidate;

}

function ClearErrorStyle(event){
  event.target.classList.remove("error-circle-mail");
  event.target.classList.add("circle-mail");
}



function sendMail() {
  var templateId = 0;

  // createPdf();

  if (!validateMail()) return;

  document.getElementById("sendByMainBtn").disabled = true; 
  
  createPdf();

  emailjs.init("user_8Cr1IxiKSaA9gSvYkmq9Q");

  var name = document.getElementById("inputName").value;
  var mail = document.getElementById("inputMail").value;
  var zipCode = document.getElementById("inpuZipCode");

  if (testResult == 5) {
    templateId = "template_3pmn0jm";
  }
  else if (testResult == 15) {
    templateId = "template_p48pjfj";
  }
  else if (testResult == 25) {
    templateId = "template_j7xp7xq";
  };

  if (document.getElementById("dontSendPersonalData").checked){
    alert("fdsfsdf")
  }


  var data = {
    service_id: 'service_wrag93q',
    template_id: templateId,
    user_id: 'user_8Cr1IxiKSaA9gSvYkmq9Q',
    template_params: {
      'from_name': 'HealthyGumz',
      'to_name': name,
      'to_mail': mail,
      'varFile': pdfBase64,
      'g-recaptcha-response': '03AHJ_ASjnLA214KSNKFJAK12sfKASfehbmfd...'
    }
  };

  document.getElementById("sendMailSuccess").style.display = "block";
  document.getElementById("sendMail").style.display = "none";

  $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json'
  }).done(function () {
    // document.getElementById("sendMailSuccess").style.display = "block";
    // document.getElementById("sendMail").style.display = "none";
  }).fail(function (error) {
    document.getElementById("sendMailUnsuccess").style.display = "block";
    document.getElementById("sendMailSuccess").style.display="none";
    document.getElementById("sendMail").style.display = "none";
  });

}

function trySendMailAgain() {
  document.getElementById("sendMailUnsuccess").style.display = "none";
  document.getElementById("sendMail").style.display = "block";
}

function createPdf() {

  window.jsPDF = window.jspdf.jsPDF;

  var doc = new jsPDF();

  doc.addImage("https://healthygumz.github.io/quiz/images/client_pdf/Logo_HG.png", "PNG", 80, 7, 42, 21);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("GUM DISEASE RISK TEST RESULT", 105, 40, null, null, "center");

  doc.setFontSize(20);

  var inputName=document.getElementById("inputName").value;

  inputName=inputName.replace(/(^|\s)\S/g, function(a) {return a.toUpperCase()});
  
  doc.text(inputName, 105, 49, null, null, "center");

  doc.setFillColor(6, 81, 185);
  doc.rect(20, 53, 85, 55, "F");

  doc.setFillColor(0, 149, 255);
  doc.rect(105, 53, 85, 55, "F");

  var textLines = doc
    .setFont("helvetica")
    .setFontSize(13)
    .setTextColor('#FFFFFF')
    .splitTextToSize("Your risk assessment result was calculated based on your responses to the following questions:", 65);

  doc.text(textLines, 30, 73);

  doc.addImage(pdfImagePath, "PNG", 116, 58, 62, 46);


  doc.autoTable({
    startY: 110,
    body: bodyQuestions,
    margin: Margin = 20,
    theme: 'striped',
    columnStyles: { 0: { cellWidth: 85 }, 1: { halign: 'right', cellWidth: 85 } },

  })

  doc.setLineWidth(0.1);
  doc.line(105, 110, 105, pdfLineHeight);

  var textBottom = doc
    .setFont("helvetica", 'bold')
    .setFontSize(18)
    .setTextColor('#000000')
    .splitTextToSize("HealthyGumz");

  doc.text(textBottom, 105, 285, null, null, "center");

  doc.addImage("https://healthygumz.github.io/quiz/images/client_pdf/internet_icon.png", "PNG", 127, 280, 5, 5);

  doc.link(85, 280, 48, 4, {
    url: "https://www.healthygumz.com/"
  });


  pdfBase64 = doc.output('datauristring');
  //  doc.save("Test.pdf");
}
