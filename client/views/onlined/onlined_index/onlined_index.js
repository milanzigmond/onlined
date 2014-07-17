/*****************************************************************************/
/* OnlinedIndex: Event Handlers and Helpers */
/*****************************************************************************/

Session.set("editing", true);

function safeFileToMongo (file) 
  { 
    console.log("saving file: " + EJSON.stringify(file));
    var reader = new FileReader();
    
    reader.onload = function(e) {
      var item = Website.findOne();
      Website.update({_id:item._id}, { $set: { image1: e.target.result }});  
      console.log("file updated to: "+e.target.result);
    }

    reader.readAsDataURL(file);
  }


Template.OnlinedIndex.events({
  
  // company name

  'keypress .companyNameInput' : function (e,t) {
    if(e.keyCode === 13){
        var newCompanyName = t.find(".companyNameInput").value;
        var id = Website.findOne()._id;        
        Website.update({_id:id}, {$set: {companyName: newCompanyName}});
        $(".companyNameInput").value = '';
        $(".companyNameInput").blur();
        $(".companyNameInput").hide(); 
        $(".companyName").show();
      }
    },

    'click .companyName' : function (e,t) {
      if(Session.get('editing')){
        e.preventDefault();
        $(".companyNameInput").width($(".companyName").width()); 
        $(".companyName").hide();
        $(".companyNameInput").show(); 
        $(".companyNameInput").focus().select();
      }
    },

    'blur .companyNameInput' : function (e,t) {
        $(".companyNameInput").hide().value = ''; 
        $(".companyName").show();
    },

    // tagline

    'keypress .taglineInput' : function (e,t) {
      if(e.keyCode === 13){
        var input = t.find(".taglineInput");
        var newTagline = input.value;
        var id = Website.findOne()._id;
        Website.update({_id:id}, {$set: {slogan: newTagline}});
        input.value = '';
        input.blur();
        $(".taglineInput").hide(); 
        $(".tagline").show();
      }
    },

    'click .tagline' : function (e,t) {
      if(Session.get('editing')){
        e.preventDefault();
        $(".taglineInput").width($(".tagline").width()); 
        $(".tagline").hide();
        $(".taglineInput").show(); 
        $(".taglineInput").focus().select();
      }
    },

    'blur .taglineInput' : function (e,t) {
        $(".taglineInput").value = '';
        $(".taglineInput").hide(); 
        $(".tagline").show();
    },

    // about us title

    'keypress .aboutUsTitleInput' : function (e,t) {
    if(e.keyCode === 13){
        var newAboutUsTitle = t.find(".aboutUsTitleInput").value;
        console.log('aboutUsTitle: '+ newAboutUsTitle);
        var id = Website.findOne()._id;        
        Website.update({_id:id}, {$set: {aboutUsTitle: newAboutUsTitle}});
        $(".aboutUsTitleInput").value = '';
        $(".aboutUsTitleInput").blur();
        $(".aboutUsTitleInput").hide(); 
        $(".aboutUsTitle").show();
      }
    },

    'click .aboutUsTitle' : function (e,t) {
      if(Session.get('editing')){
        e.preventDefault();
        $(".aboutUsTitleInput").width($(".aboutUsTitle").width()); 
        $(".aboutUsTitle").hide();
        $(".aboutUsTitleInput").show(); 
        $(".aboutUsTitleInput").focus().select();
      }
    },

    'blur .aboutUsTitleInput' : function (e,t) {
        $(".aboutUsTitleInput").hide().value = ''; 
        $(".aboutUsTitle").show();
    },

    // about us text

    'keypress .aboutUsTextInput' : function (e,t) {
    if(e.keyCode === 13){
        var newAboutUsText = t.find(".aboutUsTextInput").value;
        var id = Website.findOne()._id;        
        Website.update({_id:id}, {$set: {aboutUsText: newAboutUsText}});
        $(".aboutUsTextInput").value = '';
        $(".aboutUsTextInput").blur();
        $(".aboutUsTextInput").hide(); 
        $(".aboutUsText").show();
      }
    },

    'click .aboutUsText' : function (e,t) {
      if(Session.get('editing')){
        e.preventDefault();
        $(".aboutUsTextInput").width($(".aboutUsText").width()); 
        $(".aboutUsText").hide();
        $(".aboutUsTextInput").show(); 
        $(".aboutUsTextInput").focus().select();
      }
    },

    'blur .aboutUsTextInput' : function (e,t) {
        $(".aboutUsTextInput").hide().value = ''; 
        $(".aboutUsText").show();
    },

     // phoneNumber

    'keypress .phoneNumberInput' : function (e,t) {
    if(e.keyCode === 13){
        var newPhoneNumber = t.find(".phoneNumberInput").value;
        var id = Website.findOne()._id;        
        Website.update({_id:id}, {$set: {phoneNumber: newPhoneNumber}});
        $(".phoneNumberInput").value = '';
        $(".phoneNumberInput").blur();
        $(".phoneNumberInput").hide(); 
        $(".phoneNumber").show();
      }
    },

    'click .phoneNumber' : function (e,t) {
      if(Session.get('editing')){
        e.preventDefault();
        $(".phoneNumberInput").width($(".phoneNumber").width()); 
        $(".phoneNumber").hide();
        $(".phoneNumberInput").show(); 
        $(".phoneNumberInput").focus().select();
      }
    },

    'blur .phoneNumberInput' : function (e,t) {
        $(".phoneNumberInput").hide().value = ''; 
        $(".phoneNumber").show();
    },

    // email

    'keypress .emailInput' : function (e,t) {
    if(e.keyCode === 13){
        var newEmail = t.find(".emailInput").value;
        var id = Website.findOne()._id;        
        Website.update({_id:id}, {$set: {email: newEmail}});
        $(".emailInput").value = '';
        $(".emailInput").blur();
        $(".emailInput").hide(); 
        $(".email").show();
      }
    },

    'click .email' : function (e,t) {
      if(Session.get('editing')){
        e.preventDefault();
        $(".emailInput").width($(".email").width()); 
        $(".email").hide();
        $(".emailInput").show(); 
        $(".emailInput").focus().select();
      }
    },

    'blur .emailInput' : function (e,t) {
        $(".emailInput").hide().value = ''; 
        $(".email").show();
    },

    'dragover .drop' : function (e,t) {
      e.stopPropagation();
      e.preventDefault();
      console.log("dragged");
      $(".drop").css('border', '2px dotted #00ff00');
    },

    'drop .drop' : function (e,t) {
      e.stopPropagation();
      e.preventDefault();
      console.log("")

      var file = e.originalEvent.dataTransfer.files[0];
      safeFileToMongo(file);
    },

    'change .upload': function(e, t) {
      e.preventDefault();
      var file = t.find(".upload").files[0];
      safeFileToMongo(file);
      }
  });

Template.OnlinedIndex.helpers({

  editing : function () {return Session.get('editing');},

  companyName : function () {return (Website.findOne()) ? Website.findOne().companyName : '';},
  slogan : function () {return (Website.findOne()) ? Website.findOne().slogan : '';},
  email : function () {return (Website.findOne()) ? Website.findOne().email : '';},
  phoneNumber : function () {return (Website.findOne()) ? Website.findOne().phoneNumber : '';},
  aboutUsTitle : function () {return (Website.findOne()) ? Website.findOne().aboutUsTitle : '';},
  aboutUsText : function () {return (Website.findOne()) ? Website.findOne().aboutUsText : '';},
  address : function () {return (Website.findOne()) ? Website.findOne().address : '';},
  openingHours : function () {return (Website.findOne()) ? Website.findOne().openingHours : '';},
  testimonialText : function () {return (Website.findOne()) ? Website.findOne().testimonialText : '';},
  testimonialSignature : function () {return (Website.findOne()) ? Website.findOne().testimonialSignature : '';},
  product1Title : function () {return (Website.findOne()) ? Website.findOne().product1Title : '';},
  product1Description : function () {return (Website.findOne()) ? Website.findOne().product1Description : '';},
  product2Title : function () {return (Website.findOne()) ? Website.findOne().product2Title : '';},
  product2Description : function () {return (Website.findOne()) ? Website.findOne().product2Description : '';},
  teamMember1Name : function () {return (Website.findOne()) ? Website.findOne().teamMember1Name : '';},
  teamMember1Position : function () {return (Website.findOne()) ? Website.findOne().teamMember1Position : '';},
  teamMember2Name : function () {return (Website.findOne()) ? Website.findOne().teamMember2Name : '';},
  teamMember2Position : function () {return (Website.findOne()) ? Website.findOne().teamMember2Position : '';},
  teamMember3Name : function () {return (Website.findOne()) ? Website.findOne().teamMember3Name : '';},
  teamMember3Position : function () {return (Website.findOne()) ? Website.findOne().teamMember3Position : '';},
  

  items : function () {
    return Onlined.find({}, {
      sort: {
        created_at: -1
      }
    });
  },

  isDoneClass : function () {
    return this.is_done ? 'checked' : '';
  }
});

/*****************************************************************************/
/* OnlinedIndex: Lifecycle Hooks */
/*****************************************************************************/
Template.OnlinedIndex.created = function () {
};

Template.OnlinedIndex.rendered = function () {
};

Template.OnlinedIndex.destroyed = function () {
};

Template.OnlinedIndex.image1 = function () {
    var item = Website.findOne();
    if(!item) return "default.png";
    return item.image1;
}

GoogleMaps.init(
{
   'sensor': false, //optional
   'language': 'sk', //optional
   'libraries': 'places' //optional for autocomplete
 }, 
 function() {
  var mapOptions = {
    center: new google.maps.LatLng(-33.8688, 151.2195),
    zoom: 13
  };

  var map = new google.maps.Map(document.getElementById('map-location'), mapOptions);

  var input = document.getElementById('pac-input');

  var types = [];
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    console.log('place_changed');
    // infowindow.close();
    // marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      console.log("there is no place.geometry")
      return;
    }

    // If the place has a geometry, then present it on a map.
    console.log("place.geometry.viewport: "+place.geometry.viewport);
    console.log("place.geometry.location: "+place.geometry.location);
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
      (place.address_components[0] && place.address_components[0].short_name || ''),
      (place.address_components[1] && place.address_components[1].short_name || ''),
      (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    console.log("place.address_components: "+JSON.stringify(place.address_components));

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address + '</div>');
    infowindow.open(map, marker);
  });
});












