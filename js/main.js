const selectDesign = document.getElementById('design');
const selectShirtColor = document.getElementById('color');
let totalActivitiesCost = 0;

$('#title').on('change',function(){
  const jobRole = $(this).val();
  if(jobRole === 'other'){
      $('fieldset').eq(0).append(`<input type="text" id="title-other" placeholder="Your job role"></input`);
  }else{
    $('#title-other').remove();
  }
});

function displayShirtColorOptions(shirtTheme){
  $("#colors-js-puns").show();
  $(selectShirtColor.options).show();
  for (var i = 0; i < selectShirtColor.options.length; i++) {
    if(selectShirtColor.options[i].text.search(shirtTheme) === -1) {
      $(selectShirtColor.options[i]).hide();
    }
  }
  // selecting the first visible shirt color option
  $(selectShirtColor).find("option[style*='block']")[0].selected = true;
}

$("button[type=submit]").on('click',function(event){
  function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
  }

  function setClassError($element){
    $element.addClass('error');
    if($element.prev().prop('nodeName') === 'LABEL'){
      $element.prev().addClass('error');
    }
  }

  event.preventDefault();
  if($('#name').val()===""){
    setClassError($('#name'));
  }
  if(!isValidEmailAddress($('#mail').val())){
    setClassError($('#mail'));
  }
  if($('#title').val()==="other"){
    if($('#title-other').val()===""){
      setClassError($('#title-other'));
    }
  }

});

$('#design').on('change',function(){
  const shirtDesign = $(this).val();
  const shirtDesignText = selectDesign.options[selectDesign.selectedIndex].text;
  const shirtDesignTextShort = shirtDesignText.replace("Theme - ","");

  if(shirtDesign!=="Select Theme"){
    displayShirtColorOptions(shirtDesignTextShort);
  }else{
    $("#colors-js-puns").hide();
  }
});

$('#payment').on('change',function(){
  const paymentMethod = $(this).val().replace(' ','-');
  $('.payment-method').hide();
  if(paymentMethod === "select_method"){
    $('#credit-card').show();
  }else{
    $(`#${paymentMethod}`).show();
  }
});

// on focus on any of the input fields of the credit card form
// "Credit Card" is selected on the payment select
$('#credit-card').find('input[type="text"]').on('focus',function(){
  $('#payment').find("option")[1].selected = true;
});

$('.activities').find('input[type=checkbox]').on('change',function(){
  const activityText =  $(this).parent().text();
  const activityName = $(this).attr('name');
  const activityIsChecked = $(this)[0].checked;
  const activityDayTime = getDayTime(activityText);
  const activityCost = getCost(activityText);

  function getDayTime(activityText){
    return activityText.substring(
      activityText.indexOf('— ') + '— '.length,
      activityText.indexOf(','));
  }

  function getCost(activityText){
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

  function displayActivitiesTotalCost(){
    $('.activities p.total-cost').remove();
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

  $('.activities label').each(function(){
    const $otherActivity = $(this);
    const otherActivityName = $otherActivity.find(">:first-child").attr('name');
    const otherActivityDayTime = getDayTime($otherActivity.text());
    // check first if we have different activities and if they have the same schedule
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
});

$("#paypal").hide();
$("#bitcoin").hide();
$("#colors-js-puns").hide();
$("#colors-js-puns").find("option").css({ display: "block" });

$("select").each(function(){
  $(this).find("option")[0].selected = true;
});
$("input[type=text]").each(function(){$(this).val("")});
$("input[type=email]").each(function(){$(this).val("")});
$("input[type=checkbox]").prop('checked', false);
$('#name').focus();
