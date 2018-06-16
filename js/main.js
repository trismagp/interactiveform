const shirtsOptions = {
  "js puns":[
    {"value":"cornflowerblue","text":"Cornflower Blue"},
    {"value":"darkslategrey","text":"Dark Slate Grey"},
    {"value":"gold","text":"Gold"}
  ],
  "heart js":[
    {"value":"tomatoe","text":"Tomato"},
    {"value":"steelblue","text":"Steel Blue"},
    {"value":"dimgrey","text":"Dim Grey"}
  ]
};

function initShirtColorSelect(){
  $("#color option").remove();
  $("#color").append("<option><-- Please select a T-shirt theme</option>");
}

function appendShirtColorOptions(shirtTheme){
  $("#color option").remove();
    shirtsOptions[shirtTheme].forEach(function(element){
      $("#color").append(`
        <option value=${element["value"]}>${element["text"]}</option>
      `);
  });
}



$('#title').on('change',function(){
  const jobRole = $(this).val();
  if(jobRole === 'other'){
      $('fieldset').eq(0).append(`<input type="text" id="title-other" placeholder="Your job role"></input`);
  }else{
    $('#title-other').remove();
  }
});

$('#design').on('change',function(){
  const shirtDesign = $(this).val();
  if(shirtDesign!=="Select Theme"){
    appendShirtColorOptions(shirtDesign);
  }else{
    initShirtColorSelect();
  }
});

$('#name').focus();
initShirtColorSelect();
