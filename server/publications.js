Meteor.publish('allUsers', function () {
    return Meteor.users.find();
});

Meteor.publish('allWebsites', function () {
    return Websites.find();
});

Meteor.publish('stream', function (limit) {
    check(limit, Number);

    var self = this, // to prevent context issues online
        cursors = [],
        ids = [],
        userCursor = Users.find({_id:self.userId}),
        user = userCursor.fetch()[0],
        stream = Websites.find({}, {fields: {'content.topImage': 1, sitename: 1, userId: 1, createdAt: 1}, sort: {createdAt: 1}, limit:limit});

    // stream.forEach(function (website) {
    //     ids.push( website.userId );
    // });

    ids = stream.map(function (website) {
        return website.userId;
    });

    ids = _.uniq(ids); // leave only unique ids in array

    // userCursor.observeChanges({
    //     added: function (id, fields) {
    //         // ...
    //     }, // Use either added() OR(!) addedBefore()
    //     addedBefore: function (id, fields, before) {
    //         // ...
    //     },
    //     changed: function (id, fields) {
    //         // ...
    //     },
    //     movedBefore: function (id, fields) {
    //         // ...
    //     },
    //     removed: function (id) {
    //         // ...
    //     }
    // });

    cursors.push(stream);
    cursors.push(Users.find({_id: {$in: ids}}, { fields: { username: 1 }}));
    return cursors; 
});

Meteor.publish('myWebsites', function (userId, limit) {
    check(userId, String);
    check(limit, Number);
    return Websites.find({userId: userId}, {fields: {'content.topImage': 1, sitename: 1, userId: 1, createdAt: 1}, sort: {createdAt: 1}, limit:limit});
});

Meteor.publish('editWebsite', function (id) {
    check( id, String );
    return Websites.find({_id:id});
});

Meteor.publish('liveWebsite', function (sitename) {
    check( sitename, String );
    return Websites.find({sitename:sitename});
});

Meteor.publish('liveWebsiteImages', function ( sitename ) {
    check( sitename, String );
    var website = Websites.find({sitename:sitename});
    return Images.find({websiteId:website._id});
});

Meteor.publish('images', function (id) {
    check( id, String );
    return Images.find({websiteId:id});
});

Meteor.publish('topImages', function ( limit ) {
    check( limit, Number );
    return Images.find({contentId:'topImage'}, {limit:limit, sort: { uploadedAt: -1}});
});