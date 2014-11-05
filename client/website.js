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
    window.scrollTo(0, 0);
    showMap(this.data);
};

Template.website.helpers({
    email: function () {
        return getUserEmail();
    },
});
