Session.set('canContinue', false);

var defaultTitle = "Click on me to edit me";


function safeFile (file) {
	console.log("saving file: " + file.name);
	reader = new FileReader();
	reader.onload = function (e) {
	    console.log("file updated to: " + e.target.result);
	    Session.set('imageToUpload', e.target.result);
	}
	reader.readAsDataURL(file);
}
  

function animateIn(what) {
	TweenLite.fromTo(what, 2, {autoAlpha: 0, rotationX:-90, transformOrigin:"50% 0%", ease:Elastic.easeOut},
		{autoAlpha:1, rotationX: 0, transformOrigin:"50% 0%", ease:Elastic.easeOut}, 0.1, 0);
}

function showNextSection(section) {
	var s = "."+section;
	var sEdit = s+"Edit";
	$(s).removeClass("hidden");
	$(sEdit).removeClass("hidden");
	animateIn(s);
	animateIn(sEdit);
}

function sectionOk(section) {
	var s = "."+section;
	var sEdit = s+"Edit";
	$(sEdit).removeClass("edit");
	$(sEdit).addClass("ok");
	$(sEdit+" .icon").removeClass("glyphicon-edit");
	$(sEdit+" .icon").addClass("glyphicon-ok");
}



Template.create.rendered = function () {

	animateIn(".firstsection");
	animateIn(".firstsectionEdit");
	// showNextSection("secondsection");
};

Template.create.events({
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
        sectionOk("firstsection");
        showNextSection("secondsection");
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
    },

    'drop .drop' : function (e,t) {
    	e.stopPropagation();
	    e.preventDefault();
	    file = e.originalEvent.dataTransfer.files[0];
	    safeFile(file);
	    sectionOk("secondsection"); 		
	    showNextSection("thirdsection");
    },

	'dragover .drop' : function (e,t) {
	  	e.stopPropagation()
	    e.preventDefault()	
	} 
});

Template.create.helpers({
	imageToUpload : function () {
		return Session.get("imageToUpload") ? Session.get("imageToUpload") : "tea.jpg";
	},
	alert: function () {
		return Session.get('alert');
	},
	status: function () {
		if(Session.get('canContinue'))
	        return "success"
	    else
	        return "danger"
	},
	textValue: function () {
		if(Session.get("textValue"))
	        return Session.get("textValue");
	    else    
	        return defaultTitle;
	}
});