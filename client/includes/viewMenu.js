Template.viewMenu.events({
	'click #like': function ( event, template ) {
		preventActionsForEvent( event );

		Websites.update({_id:this.website._id}, {$inc: {likes: 1}});
		Likes.insert({websiteId:this.website._id});
	},
	'click #unlike': function ( event, template ) {
		preventActionsForEvent( event );

		Websites.update({_id:this.website._id}, {$inc: {likes: -1}});
		var like = Likes.findOne({websiteId:this.website._id, userId: Meteor.userId()});
		Likes.remove({_id:like._id});
	}
});

Template.viewMenu.helpers({
	liked: function () {
		if (!this.website) return;
		return Likes.findOne({userId:Meteor.userId(), websiteId: this.website._id});
	}
});