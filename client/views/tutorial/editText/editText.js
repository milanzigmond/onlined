Session.set('canContinue', false);

Template.editText.events({
  'keypress input' : function (e,t) {
    if(e.keyCode === 13){
        var newValue = t.find(".textInput").value;
        console.log('enter pressed: '+newValue);
        $(".textInput").value = '';
        $(".textInput").blur();
        $(".textInput").hide(); 
        $(".editableTextField").show();
        Session.set("textValue", newValue);
        Session.set("canContinue", true);
        Session.set("alert", null);
      }
    },

    'click .editableTextField' : function (e,t) {
        e.preventDefault();
        console.log('clicked');
        $(".textInput").width($(".editableTextField").width()); 
        $(".editableTextField").hide();
        field = t.find('.textInput');
        $(field).show();
        $(field).focus();
        $(field).select();
    },

    'click .continue' : function (e,t) {
        e.preventDefault();
        if (Session.get('canContinue')) {
            Router.go("editImage");
            Session.set('canContinue', false);
        }
        else {
            Session.set('alert', 'Boze ty si lama, never try again.');
        }
    },

    'blur .textInput' : function (e,t) {
        $(".textInput").hide().value = ''; 
        $(".editableTextField").show();
    },

    'mouseover .editableTextField' : function (e,t) {
        if(Session.get('canContinue'))
            $(".editableTextField").css({
                           'background-color' : '#75e444',
                           'border-radius' : '10px'
                    });
        else
            $(".editableTextField").css({
                           'background-color' : '#d9534f',
                           'border-radius' : '10px'
                    });
    },

    'mouseout .editableTextField' : function (e,t) { 
        $(".editableTextField").css('background-color','');
    }
});

Template.editText.alert = function () {
    return Session.get('alert');
}

Template.editText.status = function () {
    if(Session.get('canContinue'))
        return "success"
    else
        return "danger"
};

Template.editText.textValue = function () {
    if(Session.get("textValue"))
        return Session.get("textValue");
    else    
        return "Click on me to edit me";
};