OnlinedDetailController = RouteController.extend({

//	layoutTemplate: 'NoBreadcrumbs',

  waitOn: function () {
  	var id = this.params._id;
  	return Meteor.subscribe("onlined_detail", id);
    // return adds it to the wait list
  },

  data: function () {
  	var id = this.params._id;
  	return Onlined.findOne({_id:id});
  	// on client both find and findOne are reactive, on client only find returns a cursor
  },

  action: function () {
  	// this.layout('NoBreadcrumbs');
    // this.render('Loading', {to: 'breadcrumbs'});
    if (this.ready()) {
      this.render();
      console.log('ready');
    } else {
      this.render('Loading');
      console.log('loading');
    }
  }
});
