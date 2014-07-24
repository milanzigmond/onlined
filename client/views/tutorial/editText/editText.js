Template.editText.events({
  'keypress input' : function (e,t) {
    if(e.keyCode === 13){
        var newCompanyName = t.find(".textInput").value;
        $(".textInput").value = '';
        $(".textInput").blur();
        $(".textInput").hide(); 
        $(".editableTextField").show();
      }
    },

    'click .editableTextField' : function (e,t) {
      if(Session.get('editing')){
        e.preventDefault();
        console.log('clicked');
        $(".textInput").width($(".editableTextField").width()); 
        $(".editableTextField").hide();
        $(".textInput").show(); 
        $(".textInput").focus().select();
      }
    },

    'blur .textInput' : function (e,t) {
        $(".textInput").hide().value = ''; 
        $(".editableTextField").show();
    }
});