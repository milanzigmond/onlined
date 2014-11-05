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

showMap = function showMap (website) {

    var address = website.content.address,
        latLng = website.content.latLng;

    var mapOptions = {
            scrollwheel: false,
            // center: new google.maps.LatLng(latLng.lat, latLng.lng),
            zoom: 13
        };
    
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
        });

    marker.setVisible(false);

    map.setCenter(latLng);
    map.setZoom(13);
    
    marker.setIcon(({
        url: "logo.png",
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(latLng);
    marker.setVisible(true);

    google.maps.event.addListener(map, 'idle', function() {
        window.setTimeout(function() {
            map.panTo(marker.getPosition());
        }, 3000);
    });

    google.maps.event.addListener(marker, 'click', function() {
        map.setZoom(15);
        map.setCenter(marker.getPosition());
    });
};

autohideNavbar = function autohideNavbar () {
    $("nav.navbar-fixed-top").autoHidingNavbar({'animationDuration' : 300});
};

destroyNavbar = function destroyNavbar () {
    $("nav.navbar-fixed-top").autoHidingNavbar('destroy');
};