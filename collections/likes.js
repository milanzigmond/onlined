Likes = new Mongo.Collection("likes");

Likes.before.insert(function( userId, doc ) {
	doc.createdAt = new Date();
	doc.userId = userId;
});

Meteor.methods({
	doILikeThisWebsite: function ( userId, websiteId ) {
		check( userId, String );
		check( websiteId, String );
		var like = Likes.findOne({userId: userId, websiteId: websiteId});
		if(like) {
			console.log('i found like'); 
			return true;
		}
		console.log('no like found'); 
		return false;
	}
});

Likes.allow({
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