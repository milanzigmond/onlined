Users = Meteor.users;

Users.helpers({
	myWebsites: function () { 
		return Websites.find({userId: this._id},{sort: {createdAt: -1}});
	}
});