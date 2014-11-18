// Users

Meteor.publish('allUsers', function () {
    return Meteor.users.find();
});

// Websites

Meteor.publish('sitenameSearch', function ( query ) {  
  check( query, String ); 

  if (_.isEmpty(query))
    return this.ready();

  return Websites.search(query);
});

Meteor.publish('allWebsites', function () {
    return Websites.find();
});

Meteor.publish('stream', function ( limit ) {
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

    cursors.push(stream);
    cursors.push(Users.find({_id: {$in: ids}}, { fields: { username: 1 }}));
    return cursors; 
});

Meteor.publish('myWebsites', function (userId, limit) {
    check(userId, String);
    check(limit, Number);
    return Websites.find({userId: userId}, {fields: {'content.topImage': 1, sitename: 1, userId: 1, createdAt: 1}, sort: {createdAt: 1}, limit:limit});
    // return Websites.find({userId: userId}, {limit:limit});
});

Meteor.publish('editingWebsite', function (sitename) {
    console.log('editingWebsitePublication: '+ sitename);
    check( sitename, String );
    return Websites.find({sitename:sitename});
});

Meteor.publish('liveWebsite', function (sitename) {
    console.log('liveWebsitePublication');
    check( sitename, String );
    return Websites.find({sitename:sitename});
});

// Sections

Meteor.publish('sections', function ( sitename ) {
    console.log('sections publication called with: ' + sitename);
    check( sitename, String );
    var website = Websites.findOne({ sitename: sitename });
    return Sections.find({ websiteId: website._id });
});

// Images

Meteor.publish('liveWebsiteImages', function ( sitename ) {
    check( sitename, String );
    var website = Websites.findOne({sitename:sitename});
    return Images.find({websiteId:website._id});
});

Meteor.publish('images', function (sitename) {
    check( sitename, String );
    var id = Websites.find({sitename:sitename}).fetch()._id;
    return Images.find({websiteId:id});
});

Meteor.publish('topImages', function ( limit ) {
    check( limit, Number );
    return Images.find({contentId:'topImage'}, {limit:limit, sort: { uploadedAt: -1}});
});