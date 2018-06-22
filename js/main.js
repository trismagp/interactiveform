let totalActivitiesCost = 0;

/* =================================
  Form functions
==================================== */

function getFieldsetParent($element){
  var $parent = $element;
  while($parent.prop('nodeName') !== 'FIELDSET'){
    $parent = $parent.parent();
  }
  return $parent;
}

function removeLegendClassError($element){
  const $fieldset = getFieldsetParent($($element));
  $legend = $fieldset.children().first();
  $legend.removeClass('error');
}


function setClassError($element){
  $element.addClass('error');
  if($element.prev().prop('nodeName') === 'LABEL'){
    $element.prev().addClass('error');
  }
}

function removeClassError($element){
  $element.removeClass('error');
  if($element.prev().prop('nodeName') === 'LABEL'){
    $element.prev().removeClass('error');
  }
}

function showSnackbar(message){
  $('body').append(`<div id='snackbar'>${message}</div>`);
  $('#snackbar').addClass('show');
  setTimeout(function(){
    $('#snackbar').removeClass('show');
    $('#snackbar').remove();
  }, 3000);
}


function initFormFields(){
  $("select").each(function(){
    $(this).find("option")[0].selected = true;
  });
  $("input[type=text]").each(function(){$(this).val("")});
  $("input[type=email]").each(function(){$(this).val("")});
  $("input[type=checkbox]").prop('checked', false).removeAttr('disabled');

  $("label").removeAttr('disabled');
}

function addOnFocusListenerInput(){
  $("input[type=text]").on('focus',function(event){
    event.preventDefault();
    removeClassError($(this));
  });
  $("input[type=checkbox]").on('focus',function(event){
    event.preventDefault();
    removeClassError($(this));
  });
}

function addEventListenerSubmitButton(){
  $("button[type=submit]").on('click',function(event){
    event.preventDefault();

    var isOkCheck = true;
    isOkCheck = checkBasicInfo();
    isOkCheck = checkShirtInfo() && isOkCheck;
    isOkCheck = checkActivitiesInfo() && isOkCheck;
    isOkCheck = checkPaymentInfo() && isOkCheck;

    if(isOkCheck){
      initForm();
      showSnackbar("You've been registered");
    }else{
      showSnackbar("Please check errors");
    }
  });
}

function addEventListenersForm(){
  addOnFocusListenerInput();
  addEventListenerSubmitButton();
}

/* =================================
  Basic info start
==================================== */

function isValidEmailAddress(emailAddress) {
  var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  return pattern.test(emailAddress);
}

function checkName(){
  if($('#name').val()===""){
    setClassError($('#name'));
    return false;
  }
  return true;
}

function mailErrorMessage(emailAddress){
  if(emailAddress.length === 0){
    $('#mail').prev().append(' <span id="mail-error" class="error"> field cannot be empty</span>');
  }else{
    $('#mail').prev().append(' <span id="mail-error" class="error"> error incorrect format</span>');
  }
}

function removeMailErrorMessage(){
  $('#mail').prev().find('span').remove();
}

function checkMail(){
  const emailAddress = $('#mail').val();
  removeMailErrorMessage();
  if(!isValidEmailAddress(emailAddress)){
    setClassError($('#mail'));
    mailErrorMessage(emailAddress);
    return false;
  }
  removeClassError($('#mail'));
  return true;
}

// if "other" is selected  for "Job Role" and the related input field is empty
// then error
function checkTitleOther(){
  if($('#title').val()==="other"){
    if($('#title-other').val()===""){
      setClassError($('#title-other'));
      return false;
    }
  }
  return true;
}

function initBasicInfo(){
  $('#title-other').remove();
}


function checkBasicInfo(){
  var isOkCheck = true;
  isOkCheck = checkName();
  isOkCheck = checkMail() && isOkCheck;
  isOkCheck = checkTitleOther() && isOkCheck;

  return isOkCheck;
}

function addEventListenersBasicInfo(){
  // display input field for a job role when "other" is selected
  $('#title').on('change',function(event){

    event.preventDefault();

    // prevents form firing twice the event listener
    event.stopImmediatePropagation();

    const jobRole = $(this).val();
    if(jobRole === 'other'){
        $('#title').after(`<input type="text" id="title-other" placeholder="Your job role"></input`);
        addOnFocusListenerInput();
    }else{
      $('#title-other').remove();
    }
  });

  // real time check in mail field
  $('#mail').on('input',function(){
    checkMail();
  });
}

/* =================================
  Basic info end
==================================== */


/* =================================
  TShirt info start
==================================== */

function displayShirtColorOptions(shirtTheme){
  $("#colors-js-puns").show();
  $("#color option").show();
  for (var i = 0; i < $("#color option").length; i++) {
    if($("#color option")[i].text.search(shirtTheme) === -1) {
      $($("#color option")[i]).hide();
    }
  }
  // selecting the first visible shirt color option
  $("#color").find("option[style*='block']")[0].selected = true;
}

function initShirtInfo(){
  $("#colors-js-puns").hide();
  $("#colors-js-puns option").css({ display: "block" });
}

function checkShirtInfo(){
  if($('#design').val() === 'Select Theme'){
    setClassError($('#design'));
    return false;
  }
  return true;
}

function addEventListenersShirtInfo(){
  $('#design').on('focus',function(){
    removeClassError($('.shirt legend'));
    removeClassError($('#design'));
  });

  $('#design').on('change',function(){
    const shirtDesign = $(this).val();
    const shirtDesignText = $(this).children("option").filter(":selected").text();
    const shirtDesignTextShort = shirtDesignText.replace("Theme - ","");

    if(shirtDesign!=="Select Theme"){
      displayShirtColorOptions(shirtDesignTextShort);
    }else{
      $("#colors-js-puns").hide();
    }
  });
}
/* =================================
  TShirt info end
==================================== */

/* =================================
  Activities info start
==================================== */

// if the total cost for activities does not appear
// it means at no activity has been selected
// then error
function checkActivitiesInfo(){
  if($('.total-cost').length === 0){
      $('.activities legend').addClass('error');
      return false;
  }
  return true;
}

function getActivityDayTime(activityText){
  return activityText.substring(
    activityText.indexOf('— ') + '— '.length,
    activityText.indexOf(','));
}

function getActivityCost(activityText){
  return parseInt(
    activityText.substring(
      activityText.indexOf('$')+1,
      activityText.length));
}

function calcActivitiesTotalCost(activityIsChecked,activityCost){
  if(activityIsChecked){
    return totalActivitiesCost += activityCost;
  }
  return totalActivitiesCost -= activityCost;
}

function removeActivitiesTotalCost(){
  $('.activities p.total-cost').remove();
}

function displayActivitiesTotalCost(){
  removeActivitiesTotalCost();

  if(totalActivitiesCost > 0){
    $('.activities label').last().after(`
      <p class="total-cost">Total: $${totalActivitiesCost}</p>
      `);
  }
}

function disableActivity(activity, bool){
  activity.attr('disabled',bool);
  activity.find(">:first-child").attr('disabled',bool);
}

function initActivitiesInfo(){
  removeActivitiesTotalCost();
}

function addEventListenersActivities(){
  $('.activities input[type=checkbox]').on('change',function(e){
    e.stopImmediatePropagation();
    const activityText =  $(this).parent().text();
    const activityName = $(this).attr('name');
    const activityIsChecked = $(this)[0].checked;
    const activityDayTime = getActivityDayTime(activityText);
    const activityCost = getActivityCost(activityText);

    $('.activities label').each(function(){
      const $otherActivity = $(this);
      const otherActivityName = $otherActivity.find(">:first-child").attr('name');
      const otherActivityDayTime = getActivityDayTime($otherActivity.text());

      // check first if activities are different and if they have the same schedule
      if(otherActivityName !== activityName && otherActivityDayTime === activityDayTime){
        if(activityIsChecked){
          disableActivity($otherActivity,true);
        }else{
          disableActivity($otherActivity,false);
        }
      }
    });

    calcActivitiesTotalCost(activityIsChecked,activityCost);
    displayActivitiesTotalCost();
    removeLegendClassError($(this));
  });
}
/* =================================
  Activities info end
==================================== */


/* =================================
  Payments info start
==================================== */

function hasNumOnly(val){
  var reg = new RegExp('^[0-9]+$');
  return reg.test(val);
}

// must contain only numbers and length equal to 5
function isValidZipCode($zipCode){
  return hasNumOnly($zipCode) && $zipCode.length === 5;
}

// must contain only numbers and length equal to 3
function isValidCVV($cvv){
  return hasNumOnly($cvv) && $cvv.length === 3;
}

// must contain only numbers and length in [13,16]
function isValidCCNum($ccnum){
  return hasNumOnly($ccnum) && $ccnum.length >= 13 && $ccnum.length <= 16;
}


// check if cedit card expiration date is ok
function isValidExpirationDate($year,$month){
  const expirationDate = new Date($year.val(),$month.val());
  return expirationDate > Date.now();
}

function checkCreditCardInputField($element, minLength, maxLength){
  $element.prev().find('span').remove();
  if(!hasNumOnly($element.val())){
    $element.prev().append("<span class='error'> num only</span>");
    setClassError($element);
    return false;
  }

  if($element.val().length < minLength){
    $element.prev().append("<span class='error'> too short</span>");
    setClassError($element);
    return false;
  }

  if($element.val().length > maxLength){
    $element.prev().append("<span class='error'> too long</span>");
    setClassError($element);
    return false;
  }

  removeClassError($element);
  return true;

}

function checkCreditCardInfo(){
  var isOkCheck = true;
  if($('#payment').val() === 'credit card'){

    isOkCheck = checkCreditCardInputField($('#cc-num'),13,16) && isOkCheck;
    isOkCheck = checkCreditCardInputField($('#zip'),5,5) && isOkCheck;
    isOkCheck = checkCreditCardInputField($('#cvv'),3,3) && isOkCheck;

    if(!isValidExpirationDate($('#exp-year'),$('#exp-month'))){
      setClassError($('#exp-year'));
      setClassError($('#exp-month'));
      isOkCheck = false;
    }
  }
  return isOkCheck;
}

function checkPaymentInfo(){
  if($('#payment').val() === 'credit card'){
    return checkCreditCardInfo();
  }
  return true;
}

function initPaymentInfo(){
  // select "credit card" payment option
  $('#payment option')[1].selected = true;


  $("#credit-card").show();
  $("#credit-card input").each(function(){removeClassError($(this))});
  $("#credit-card select").each(function(){removeClassError($(this))});

  // hides paypal and bitcoin payment sections
  $("#paypal").hide();
  $("#bitcoin").hide();
}

function paymentErrorMessage(emailAddress){
  if(emailAddress.length === 0){
    $('#mail').prev().append(' <span id="mail-error" class="error"> field cannot be empty</span>');
  }else{
    $('#mail').prev().append(' <span id="mail-error" class="error"> error incorrect format</span>');
  }
}

function addEventListenersPayments(){
  // display the good payment section on payment select change
  $('#payment').on('change',function(event){
    event.preventDefault();
    const paymentMethod = $(this).val().replace(' ','-');
    $('.payment-method').hide();
    $(`#${paymentMethod}`).show();
    removeClassError($('#payment'));
  });

  // on focus on any of the input fields of the credit card form
  // "Credit Card" is selected on the payment select
  $('#credit-card input[type="text"]').on('focus',function(event){
    event.preventDefault();
    $(this).prev().find('span').remove();
    removeClassError($('#payment'));
  });

  // on month or year select click removes the error class on both
  $('#credit-card select').on('click',function(event){
    event.preventDefault();
    removeClassError($('#exp-year'));
    removeClassError($('#exp-month'));
  });

  // real time check in credit card num field
  $('#cc-num').on('input',function(event){
    event.preventDefault();
    checkCcNum($('#cc-num'),13,16);
  });

  // real time check in credit card num field
  $('#zip').on('input',function(event){
    event.preventDefault();
    checkCcNum($('#zip'),5,5);
  });

  // real time check in credit card num field
  $('#cvv').on('input',function(event){
    event.preventDefault();
    checkCcNum($('#cvv'),3,3);
  });

}
/* =================================
  Payments info end
==================================== */


function initForm(){

  totalActivitiesCost = 0;

  // init the entire form
  initFormFields();


  // init fieldsets
  initBasicInfo();
  initShirtInfo();
  initActivitiesInfo();
  initPaymentInfo();



  // add all listeners
  addEventListenersBasicInfo();
  addEventListenersShirtInfo();
  addEventListenersActivities();
  addEventListenersPayments();
  addEventListenersForm();



  // focus on name input field
  $('#name').focus();
}


initForm();
