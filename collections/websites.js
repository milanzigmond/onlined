Websites = new Mongo.Collection("websites");

Websites.helpers({
	username: function () {
		var user = Meteor.users.findOne({_id:this.userId});
		if(user){
			return user.username;
		}
	},
	largeImage: function () {
		var largeImageSection = Sections.findOne({websiteId: this._id});
		if(largeImageSection) {
			return largeImageSection.data.image;
		}
	}
});

RegExp.escape = function(s) {  
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

Websites.search = function( query ) {  
	console.log(query);
  return Websites.find({ sitename: { $regex: RegExp.escape(query), $options: 'i' } }, {limit: 20});
};

function createDefaultSectionsForWebsite ( websiteId ) {
	var defaultSections = ['largeImage', 
							'title',
							'intro',
							'email',
							'threeColumns',
							'gallery',
							'location',
							'phoneNumber',
							'openingHours',
							'products',
							'links',
							'team'
							];

	var rank = 0;
	_.each( defaultSections, function ( section ) {
		Sections.insert( { name:section, rank: rank, websiteId: websiteId } );
		rank++;
	})
}

Websites.before.insert(function( userId, doc ) {
	doc.createdAt = new Date();
	doc.style = 'default';
	doc.userId = userId;
	doc.likes = 0;
});

Websites.after.insert( function( userId, doc ) {
	if(Meteor.isClient) {
		// to prevent calling second time on the server
		createDefaultSectionsForWebsite( this._id );	
	}
});

Websites.allow({
	insert: function (userId, doc) {
		return (userId && doc.userId === userId);
	},
	update: function (userId, doc, fields, modifier) {
		return doc.userId === userId;
	},
	remove: function (userId, doc) {
		return doc.userId === userId;
	}
});

Websites.deny({
	update: function (userId, docs, fields, modifier) {
		return _.contains(fields, 'userId');
	}
});

Meteor.methods({
	removeWebsite: function ( websiteId ) {
		check( websiteId, String );
		Sections.remove({ websiteId:  websiteId });
        Websites.remove({ _id: websiteId });
        Likes.remove({ websiteId: websiteId});
	},
    checkDuplicity: function ( sitename ) {
    	check( sitename, String );
    	
        var sitename = sitename.toLowerCase(),
            exists = Websites.find({sitename:sitename}).count();

        if( exists > 0 ) return false;
        return true;
    },
    updateLocation: function ( websiteId, address, latLng ) {
    	console.log(websiteId, address, latLng);
    	check( websiteId, String );
    	check( address, String );
    	check( latLng, Object );

    	Websites.update({_id:websiteId}, {$set: { 
            'content.address': address,
            'content.latLng': latLng
        }});
    }
});


