// Users

Meteor.publish('allUsers', function () {
    return Meteor.users.find();
});

// Websites

Meteor.publish('sitenameSearch', function ( query ) {  
  check( query, String ); 

  if (_.isEmpty(query))
    return this.ready();

    console.log('query:'+query);

  return Websites.search(query);
});

Meteor.publish('stream', function ( limit ) {
    console.log('streamPublication');
    check(limit, Number);

    var cursors = [],
        largeImageSections = [],
        userIds = [],
        imageIds = [],
        websiteIds = [];
        
    largeImageSections = Sections.find({name:'largeImage'}, {sort: {createdAt: 1}, limit: limit});
    
    imageIds = largeImageSections.map(function (section) {return section.data.image;});
    websiteIds = largeImageSections.map(function (section) {return section.websiteId;});
    userIds = largeImageSections.map(function (section) {return section.userId;});

    // leave only uniques in arrays
    imageIds = _.uniq(imageIds);
    websiteIds = _.uniq(websiteIds);
    userIds = _.uniq(userIds);

    cursors.push(largeImageSections);
    cursors.push(Websites.find({_id: {$in: websiteIds}}, {fields: {sitename: 1, userId: 1, createdAt: 1}, sort: {createdAt: 1}, limit:limit}))
    cursors.push(Users.find({_id: {$in: userIds}}, { fields: { username: 1 }}));
    cursors.push(Images.find({_id: {$in: imageIds}}));
    return cursors; 
});

Meteor.publish('myLikes', function (userId, limit) {
    console.log('myLikesPublication');
    check(userId, String);
    check(limit, Number);

    return Likes.find({userId: userId}, {limit: limit}); 
});

Meteor.publish('myWebsites', function (userId, limit) {
    console.log('myWebsitesPublication');
    check(userId, String);
    check(limit, Number);

    var cursors = [],
        largeImageSections = [],
        imageIds = [],
        websiteIds = [],
        myWebsites = Websites.find({userId: userId}, {sort: {createdAt: 1}, limit:limit});

    websiteIds = myWebsites.map(function (website) { return website._id; });
    
    largeImageSections = Sections.find({name: 'largeImage', _id: {$in: websiteIds}}, {sort: {createdAt: 1}, limit:limit} );
    
    imageIds = largeImageSections.map(function (section) {return section.data.image;});

    // imageIds = _.uniq(imageIds);
    // websiteIds = _.uniq(websiteIds);

    cursors.push(myWebsites);
    cursors.push(largeImageSections);
    cursors.push(Images.find({_id: {$in: imageIds}}));
    return cursors; 
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