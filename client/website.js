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
    // Deps.autorun(function() {
    //     var latLng = Websites.findOne().content.latLng;
    //     showMap(latLng);
    // });
};

Template.website.helpers({
    email: function () {
        return getUserEmail();
    }
});