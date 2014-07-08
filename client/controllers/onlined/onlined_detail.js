OnlinedDetailController = RouteController.extend({

//	layoutTemplate: 'NoBreadcrumbs',

  waitOn: function () {
  	var id = this.params._id;
  	Meteor.subscribe("onlined_detail", id);
  },

  data: function () {
  	var id = this.params._id;
  	return Onlined.findOne({_id:id});
  	// on client both find and findOne are reactive, on client only find returns a cursor
  },

  action: function () {
  	this.layout('NoBreadcrumbs');
    this.render();
  }
});
