/*****************************************************************************/
/* OnlinedIndex: Event Handlers and Helpers */
/*****************************************************************************/
Template.OnlinedIndex.events({
  /*
   * Example: 
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
 });

Template.OnlinedIndex.helpers({

  companyName : function () {return Website.findOne().companyName;},
  slogan : function () {return Website.findOne().slogan;},
  email : function () {return Website.findOne().email;},
  phoneNumber : function () {return Website.findOne().phoneNumber;},
  aboutUsTitle : function () {return Website.findOne().aboutUsTitle;},
  aboutUsText : function () {return Website.findOne().aboutUsText;},
  address : function () {return Website.findOne().address;},
  openingHours : function () {return Website.findOne().openingHours;},
  testimonialText : function () {return Website.findOne().testimonialText;},
  testimonialSignature : function () {return Website.findOne().testimonialSignature;},
  product1Title : function () {return Website.findOne().product1Title;},
  product1Description : function () {return Website.findOne().product1Description;},
  product2Title : function () {return Website.findOne().product2Title;},
  product2Description : function () {return Website.findOne().product2Description;},
  teamMember1Name : function () {return Website.findOne().teamMember1Name;},
  teamMember1Position : function () {return Website.findOne().teamMember1Position;},
  teamMember2Name : function () {return Website.findOne().teamMember2Name;},
  teamMember2Position : function () {return Website.findOne().teamMember2Position;},
  teamMember3Name : function () {return Website.findOne().teamMember3Name;},
  teamMember3Position : function () {return Website.findOne().teamMember3position;},
 

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















