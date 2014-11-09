function getUserEmail () {
    if(!Meteor.user()) return;
    var email,
    emails = Meteor.user().emails,
    services = Meteor.user().services;

    if (emails) {
        email = emails[0].address;
    } else if (services) {
        email = services.facebook.email;
    };

    return email;
};

Template.website.rendered = function () {
    // window.scrollTo(0, 0);
    console.log('template rendered');
    // showMap(this.content.latLng);

    Deps.autorun(function() {
        var latLng = Websites.findOne().content.latLng;
        showMap(latLng);
    });

};

Template.website.helpers({
    email: function () {
        return getUserEmail();
    }
    // ,
    // showMap: function (lat) {
    //     console.log('showMap: ' + lat);

    //     // Tracker.afterFlush(function () {
    //     //     console.log('after flush: '+ this);
    //     //     showMap(this.content.latLng);    
    //     // })
        
    // }
});