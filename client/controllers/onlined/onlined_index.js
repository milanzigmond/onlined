OnlinedIndexController = RouteController.extend({
  waitOn: function () {
  	Meteor.subscribe('website_index');
  },

  data: function () {
  },

  onBeforeAction : function () {
  },

  action: function () {
    console.log('IronLocation.origin: '+IronLocation.origin());
    this.render();
  }
});
