// template helpers

Template.registerHelper("formatDate", function(datetime) {
    if (moment) {
        return moment(datetime).fromNow();
    }
    else {
        return datetime;
    }
});

Template.registerHelper("showImage", function(id) {
    // var defaultImage = "/defaultTopImage.png";
    var defaultImage = "";
    if(!id) return defaultImage;
    // console.log('id:'+id);
    var file = Images.findOne(id);
    if(!file) return defaultImage;
    // console.log('showImage:'+file.contentId);
    return file.url();
});

Template.registerHelper('toUpperCase', function(str) {
    // check(str, String);
    if(!str) return;
    return str.toUpperCase();
});

// functions

animateNegativeRaction = function animateNegativeRaction ( event ) {
    console.log('animateNegativeRaction');
    if (!$(event.target).is(':animated')) {
        $(event.target).animate({'margin-left':'-5px'},70).animate({'margin-left':'5px'}, 70).animate({'margin-left':'-5px'},70).animate({'margin-left':'0px'}, 70);    
    };
};

preventActionsForEvent = function preventActionsForEvent (event) {
    event.preventDefault();
    event.stopPropagation();
};

showMap = function showMap (latLng) {
    if(!latLng) return;

    var myLatlng = new google.maps.LatLng(latLng.lat,latLng.lng);
    var mapOptions = {
      zoom: 13,
      scrollwheel: false,
      center: myLatlng
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng
    });

    marker.setMap(map);    

    google.maps.event.addListener(marker, 'click', function() {
        map.setZoom(13);
        map.setCenter(marker.getPosition());
    });
};

autohideNavbar = function autohideNavbar () {
    $("nav.navbar-fixed-top").autoHidingNavbar({'animationDuration' : 300});
};

destroyNavbar = function destroyNavbar () {
    $("nav.navbar-fixed-top").autoHidingNavbar('destroy');
};