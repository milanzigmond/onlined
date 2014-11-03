Meteor.publish('allUsers', function () {
    return Meteor.users.find();
});

Meteor.publish('allWebsites', function () {
    return Websites.find();
});

Meteor.publish('stream', function (limit) {
    check(limit, Number);
    return Websites.find({}, {limit:limit});
});

Meteor.publish('myWebsites', function (userId, limit) {
    check(userId, String);
    check(limit, Number);
    return Websites.find({userId: userId});
});

Meteor.publish('editWebsite', function (id) {
    return Websites.find({_id:id});
});

Meteor.publish('liveWebsite', function (sitename) {
    return Websites.find({sitename:sitename});
});

Meteor.publish('liveWebsiteImages', function ( sitename ) {
    var website = Websites.find({sitename:sitename});
    return Images.find({websiteId:website._id});
});

Meteor.publish('images', function (id) {
    return Images.find({websiteId:id});
});

Meteor.publish('topImages', function ( limit ) {
    return Images.find({contentId:'topImage'}, {limit:limit, sort: { uploadedAt: -1}});
});